<?php
// ============================================================
// api/search.php  –  Search / filter listings for the map view
// ============================================================
// Routes
//   GET ?action=cities            – all cities with coordinates
//   GET ?action=filter            – filter listings by price range
//                                   &min=10000&max=40000
//   GET ?action=city_listings     – listings in one city
//                                   &city_id=
// ============================================================

require_once __DIR__ . '/../db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'GET' && $action === 'cities'         => getCities(),
    $method === 'GET' && $action === 'filter'         => filterListings(),
    $method === 'GET' && $action === 'city_listings'  => getCityListings(),
    default => jsonResponse(['success' => false, 'error' => 'Invalid route.'], 400),
};

// ── ALL CITIES (populates the City <select>) ──────────────────
function getCities(): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, name, province, lat, lng FROM cities ORDER BY name');
    $stmt->execute();

    jsonResponse(['success' => true, 'cities' => $stmt->fetchAll()]);
}

// ── FILTER BY PRICE RANGE ─────────────────────────────────────
// Returns distinct cities that have at least one listing in range,
// together with the min price found per city — mirrors the old
// JS options[] array but driven by real data.
function filterListings(): void {
    $min = max(0, (int)($_GET['min'] ?? 0));
    $max = (int)($_GET['max'] ?? 999999999);

    if ($max < $min) {
        // Swap if user somehow sends inverted range
        [$min, $max] = [$max, $min];
    }

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT ci.id   AS city_id,
               ci.name AS city,
               ci.lat,
               ci.lng,
               MIN(l.price) AS min_price,
               l.listing_type AS type
        FROM   listings l
        JOIN   cities ci ON l.city_id = ci.id
        WHERE  l.is_active = 1
          AND  l.price BETWEEN ? AND ?
        GROUP  BY ci.id, l.listing_type
        ORDER  BY min_price ASC
    ');
    $stmt->execute([$min, $max]);

    jsonResponse(['success' => true, 'results' => $stmt->fetchAll()]);
}

// ── LISTINGS IN ONE CITY (for map pin detail) ─────────────────
function getCityListings(): void {
    $cityId = $_GET['city_id'] ?? null;
    if (!$cityId || !is_numeric($cityId)) {
        jsonResponse(['success' => false, 'error' => 'Valid city_id required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT l.id, l.title, l.price, l.bedrooms, l.bathrooms,
               l.main_image, l.listing_type,
               c.name AS category_name
        FROM   listings l
        JOIN   categories c ON l.category_id = c.id
        WHERE  l.city_id = ? AND l.is_active = 1
        ORDER  BY l.price ASC
    ');
    $stmt->execute([(int)$cityId]);

    jsonResponse(['success' => true, 'listings' => $stmt->fetchAll()]);
}
