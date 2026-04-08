<?php
// ============================================================
// api/users.php  –  User auth & profile endpoints
// ============================================================
// Routes (method + ?action=)
//   POST   ?action=signup          – create account
//   POST   ?action=login           – authenticate
//   GET    ?action=profile         – get logged-in user (requires ?id=)
//   POST   ?action=update_profile  – update profile with image upload
//   POST   ?action=change_password – change password
// ============================================================

require_once __DIR__ . '/../db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'POST' && $action === 'signup'          => signup(),
    $method === 'POST' && $action === 'login'           => login(),
    $method === 'GET'  && $action === 'profile'         => getProfile(),
    $method === 'POST' && $action === 'update_profile'  => updateProfile(),
    $method === 'POST' && $action === 'change_password' => changePassword(),
    default => jsonResponse(['success' => false, 'error' => 'Invalid route.'], 400),
};

// ── SIGNUP ────────────────────────────────────────────────────
function signup(): void {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required = ['username', 'email', 'password'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            jsonResponse(['success' => false, 'error' => "$field is required."], 400);
        }
    }

    // Basic email format check
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'error' => 'Invalid email format.'], 400);
    }

    // Password length
    if (strlen($data['password']) < 6) {
        jsonResponse(['success' => false, 'error' => 'Password must be at least 6 characters.'], 400);
    }

    $db = getDB();

    // Check for duplicate email
    $check = $db->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute([$data['email']]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Email already registered.'], 409);
    }

    // Check for duplicate username
    $check = $db->prepare('SELECT id FROM users WHERE username = ?');
    $check->execute([$data['username']]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'error' => 'Username already taken.'], 409);
    }

    // Hash password
    $hash = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $db->prepare('
        INSERT INTO users (username, email, password_hash, phone, role, profile_pic)
        VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        htmlspecialchars(strip_tags($data['username'])),
        $data['email'],
        $hash,
        $data['phone'] ?? null,
        $data['role']  ?? 'tenant',
        'USER.svg'
    ]);

    $userId = $db->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => 'Account created successfully.',
        'user_id' => $userId
    ], 201);
}

// ── LOGIN ─────────────────────────────────────────────────────
function login(): void {
    $data = json_decode(file_get_contents('php://input'), true);

    $identifier = $data['identifier'] ?? '';
    $password   = $data['password']   ?? '';

    if (empty($identifier) || empty($password)) {
        jsonResponse(['success' => false, 'error' => 'Username/Email and password are required.'], 400);
    }

    $db = getDB();

    // Try to find user by email OR username (case-insensitive)
    $stmt = $db->prepare('
        SELECT id, username, email, password_hash, role, profile_pic
        FROM users 
        WHERE (LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)) 
        AND is_active = 1
    ');
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['success' => false, 'error' => 'Invalid username/email or password.'], 401);
    }

    // Remove hash before sending to client
    unset($user['password_hash']);

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'user'    => $user
    ]);
}

// ── GET PROFILE ───────────────────────────────────────────────
function getProfile(): void {
    $id = $_GET['id'] ?? null;
    if (!$id || !is_numeric($id)) {
        jsonResponse(['success' => false, 'error' => 'Valid user ID required.'], 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT id, username, email, phone, profile_pic, role, created_at FROM users WHERE id = ?');
    $stmt->execute([(int)$id]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'error' => 'User not found.'], 404);
    }

    jsonResponse(['success' => true, 'user' => $user]);
}

// ── UPDATE PROFILE (with image upload) ────────────────────────
function updateProfile(): void {
    $userId   = $_POST['user_id'] ?? null;
    $username = $_POST['username'] ?? null;
    $email    = $_POST['email'] ?? null;
    $phone    = $_POST['phone'] ?? null;

    if (!$userId || !is_numeric($userId)) {
        jsonResponse(['success' => false, 'error' => 'Valid user ID required.'], 400);
    }

    $db = getDB();

    // Check if username is taken by another user
    if ($username) {
        $check = $db->prepare('SELECT id FROM users WHERE username = ? AND id != ?');
        $check->execute([$username, $userId]);
        if ($check->fetch()) {
            jsonResponse(['success' => false, 'error' => 'Username already taken.'], 409);
        }
    }

    // Check if email is taken by another user
    if ($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['success' => false, 'error' => 'Invalid email format.'], 400);
        }
        $check = $db->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $check->execute([$email, $userId]);
        if ($check->fetch()) {
            jsonResponse(['success' => false, 'error' => 'Email already registered.'], 409);
        }
    }

    // Handle profile image upload
    $profilePic = null;
    if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = $_FILES['profile_image']['type'];
        
        if (!in_array($fileType, $allowedTypes)) {
            jsonResponse(['success' => false, 'error' => 'Invalid image format. Only JPG, PNG, GIF, WEBP allowed.'], 400);
        }

        // Max 5MB
        if ($_FILES['profile_image']['size'] > 5 * 1024 * 1024) {
            jsonResponse(['success' => false, 'error' => 'Image too large. Max 5MB.'], 400);
        }

        $extension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
        $filename  = 'profile_' . $userId . '_' . time() . '.' . $extension;
        $uploadDir = __DIR__ . '/../uploads/';
        
        // Create uploads directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uploadPath = $uploadDir . $filename;
        
        if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadPath)) {
            $profilePic = 'uploads/' . $filename;
        } else {
            jsonResponse(['success' => false, 'error' => 'Failed to upload image.'], 500);
        }
    }

    // Build dynamic UPDATE query
    $sets   = [];
    $values = [];

    if ($username !== null) {
        $sets[]   = 'username = ?';
        $values[] = htmlspecialchars(strip_tags($username));
    }
    if ($email !== null) {
        $sets[]   = 'email = ?';
        $values[] = $email;
    }
    if ($phone !== null) {
        $sets[]   = 'phone = ?';
        $values[] = htmlspecialchars(strip_tags($phone));
    }
    if ($profilePic !== null) {
        $sets[]   = 'profile_pic = ?';
        $values[] = $profilePic;
    }

    if (empty($sets)) {
        jsonResponse(['success' => false, 'error' => 'No fields to update.'], 400);
    }

    $values[] = (int)$userId;
    $sql = 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?';
    $db->prepare($sql)->execute($values);

    // Fetch updated user
    $stmt = $db->prepare('SELECT id, username, email, phone, profile_pic, role FROM users WHERE id = ?');
    $stmt->execute([(int)$userId]);
    $user = $stmt->fetch();

    jsonResponse([
        'success' => true,
        'message' => 'Profile updated successfully.',
        'user'    => $user
    ]);
}

// ── CHANGE PASSWORD ───────────────────────────────────────────
function changePassword(): void {
    $data = json_decode(file_get_contents('php://input'), true);

    $userId          = $data['user_id'] ?? null;
    $currentPassword = $data['current_password'] ?? '';
    $newPassword     = $data['new_password'] ?? '';

    if (!$userId || !is_numeric($userId)) {
        jsonResponse(['success' => false, 'error' => 'Valid user ID required.'], 400);
    }

    if (empty($currentPassword) || empty($newPassword)) {
        jsonResponse(['success' => false, 'error' => 'Current and new passwords are required.'], 400);
    }

    if (strlen($newPassword) < 6) {
        jsonResponse(['success' => false, 'error' => 'New password must be at least 6 characters.'], 400);
    }

    $db = getDB();

    // Verify current password
    $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([(int)$userId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
        jsonResponse(['success' => false, 'error' => 'Current password is incorrect.'], 401);
    }

    // Update password
    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $stmt = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->execute([$newHash, (int)$userId]);

    jsonResponse([
        'success' => true,
        'message' => 'Password changed successfully.'
    ]);
}