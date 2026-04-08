<?php
// ============================================================
// api/listings.php  –  Property / listing endpoints
// ============================================================
// Routes
//   GET  ?action=all          – every active listing
//   GET  ?action=trending     – listings where is_trending = 1
//   GET  ?action=by_category  – filter by ?category_id=
//   GET  ?action=single       – one listing + its images (?id=)
//   POST ?action=create       – add a new listing (manager/admin)
//   PUT  ?action=update       – edit an existing listing
//   DELETE ?action=delete     – soft-delete (?id=)
// ============================================================

require_once __DIR__ . '/../db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'GET'    && $action === 'all'          => getAllListings(),
    $method === 'GET'    && $action === 'trending'    => getTrendingListings(),
    $method === 'GET'    && $action === 'by_category' => getByCategory(),
    $method === 'GET'    && $action === 'single'      => getSingleListing(),
    $method === 'POST'   && $action === 'create'      => createListing(),
    $method === 'PUT'    && $action === 'update'      => updateListing(),
    $method === 'DELETE' && $action === 'delete'      => deleteListing(),
    default => jsonResponse(['success' => false, 'error' => 'Invalid route.'], 400),
};

// ── ALL LISTINGS ──────────────────────────────────────────────
function getAllListings(): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT l.*, c.name AS category_name, ci.name AS city_name,
               ci.lat, ci.lng
        FROM   listings l
        JOIN   categories c ON l.category_id = c.id
        JOIN   cities ci    ON l.city_id     = ci.id
        WHERE  l.is_active = 1
        ORDER  BY l.created_at DESC
    ');
    $stmt->execute();

    jsonResponse(['success' => true, 'listings' => $stmt->fetchAll()]);
}

// ── TRENDING (carousel "TOP PICKS") ───────────────────────────
function getTrendingListings(): void {
    $db   = getDB();
    $stmt = $db->prepare('
        SELECT l.id, l.title, l.price, l.bedrooms, l.bathrooms,
               l.main_image, l.listing_type,
               c.name  AS category_name,
               ci.name AS city_name
        FROM   listings l
        JOIN   categories c ON l.category_id = c.id
        JOIN   cities ci    ON l.city_id     = ci.id
        WHERE  l.is_trending = 1 AND l.is_active = 1
        ORDER  BY l.price ASC
    ');
    $stmt->execute();

    jsonResponse(['success' => true, 'trending' => $stmt->fetchAll()]);
}

// ── BY CATEGORY ───────────────────────────────────────────────
function getByCategory(): void {
    $catId = $_GET['category_id'] ?? null;
    if (!$catId || !is_numeric($catId)) {
        jsonResponse(['success' => false, 'error' => 'Valid category_id required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT l.*, ci.name AS city_name, ci.lat, ci.lng
        FROM   listings l
        JOIN   cities ci ON l.city_id = ci.id
        WHERE  l.category_id = ? AND l.is_active = 1
        ORDER  BY l.price ASC
    ');
    $stmt->execute([(int)$catId]);

    jsonResponse(['success' => true, 'listings' => $stmt->fetchAll()]);
}

// ── SINGLE LISTING + IMAGES ───────────────────────────────────
function getSingleListing(): void {
    $id = $_GET['id'] ?? null;
    if (!$id || !is_numeric($id)) {
        jsonResponse(['success' => false, 'error' => 'Valid listing ID required.'], 400);
    }

    $db = getDB();

    // Main listing data
    $stmt = $db->prepare('
        SELECT l.*, c.name AS category_name, c.slug AS category_slug,
               ci.name AS city_name, ci.province, ci.lat, ci.lng
        FROM   listings l
        JOIN   categories c ON l.category_id = c.id
        JOIN   cities ci    ON l.city_id     = ci.id
        WHERE  l.id = ? AND l.is_active = 1
    ');
    $stmt->execute([(int)$id]);
    $listing = $stmt->fetch();

    if (!$listing) {
        jsonResponse(['success' => false, 'error' => 'Listing not found.'], 404);
    }

    // Extra images
    $imgStmt = $db->prepare('SELECT image_url, sort_order FROM listing_images WHERE listing_id = ? ORDER BY sort_order');
    $imgStmt->execute([(int)$id]);
    $listing['images'] = $imgStmt->fetchAll();

    jsonResponse(['success' => true, 'listing' => $listing]);
}

// ── CREATE LISTING ────────────────────────────────────────────
function createListing(): void {
    $data = json_decode(file_get_contents('php://input'), true);

    $required = ['category_id', 'city_id', 'title', 'price', 'main_image'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            jsonResponse(['success' => false, 'error' => "$field is required."], 400);
        }
    }

    $db = getDB();

    $stmt = $db->prepare('
        INSERT INTO listings
            (category_id, city_id, title, description, price,
             bedrooms, bathrooms, sqm, listing_type, main_image, is_trending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        (int)$data['category_id'],
        (int)$data['city_id'],
        htmlspecialchars(strip_tags($data['title'])),
        $data['description']   ?? null,
        (float)$data['price'],
        (int)($data['bedrooms']    ?? 1),
        (int)($data['bathrooms']   ?? 1),
        $data['sqm']               ?? null,
        $data['listing_type']      ?? 'RFO',
        $data['main_image'],
        (int)($data['is_trending'] ?? 0)
    ]);

    $listingId = $db->lastInsertId();

    // Insert extra images if provided
    if (!empty($data['images']) && is_array($data['images'])) {
        $imgStmt = $db->prepare('INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES (?, ?, ?)');
        foreach ($data['images'] as $i => $imgUrl) {
            $imgStmt->execute([$listingId, $imgUrl, $i]);
        }
    }

    jsonResponse([
        'success'   => true,
        'message'   => 'Listing created.',
        'listing_id'=> $listingId
    ], 201);
}

// ── UPDATE LISTING ────────────────────────────────────────────
function updateListing(): void {
    $data = json_decode(file_get_contents('php://input'), true);
    $id   = $data['id'] ?? null;

    if (!$id || !is_numeric($id)) {
        jsonResponse(['success' => false, 'error' => 'Valid listing ID required.'], 400);
    }

    $db      = getDB();
    $allowed = ['title', 'description', 'price', 'bedrooms', 'bathrooms', 'sqm',
                'listing_type', 'main_image', 'is_trending', 'category_id', 'city_id'];
    $sets    = [];
    $values  = [];

    foreach ($allowed as $field) {
        if (isset($data[$field])) {
            $sets[]   = "$field = ?";
            $values[] = in_array($field, ['price']) ? (float)$data[$field] :
                        (in_array($field, ['bedrooms','bathrooms','sqm','is_trending','category_id','city_id'])
                            ? (int)$data[$field]
                            : htmlspecialchars(strip_tags($data[$field])));
        }
    }

    if (empty($sets)) {
        jsonResponse(['success' => false, 'error' => 'No valid fields to update.'], 400);
    }

    $values[] = (int)$id;
    $db->prepare('UPDATE listings SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($values);

    jsonResponse(['success' => true, 'message' => 'Listing updated.']);
}

// ── SOFT DELETE ────────────────────────────────────────────────
function deleteListing(): void {
    $id = $_GET['id'] ?? null;
    if (!$id || !is_numeric($id)) {
        jsonResponse(['success' => false, 'error' => 'Valid listing ID required.'], 400);
    }

    $db = getDB();
    $db->prepare('UPDATE listings SET is_active = 0 WHERE id = ?')->execute([(int)$id]);

    jsonResponse(['success' => true, 'message' => 'Listing deactivated.']);
}
