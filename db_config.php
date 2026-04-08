<?php
// ============================================================
// db_config.php  –  Single source of truth for DB connection
// ============================================================
// Place this file OUTSIDE your web-root when deploying, or
// at minimum add it to .gitignore so credentials are not
// committed to version control.
// ============================================================

// ── Credentials  (override via environment variables in prod) ──
define('DB_HOST',     getenv('AOS_DB_HOST')     ?: 'localhost');
define('DB_PORT',     getenv('AOS_DB_PORT')     ?: '3306');
define('DB_NAME',     getenv('AOS_DB_NAME')     ?: 'aos_db');
define('DB_USER',     getenv('AOS_DB_USER')     ?: 'root');
define('DB_PASS',     getenv('AOS_DB_PASS')     ?: '');         // change in production
define('DB_CHARSET',  'utf8mb4');

// ── Singleton PDO connection ──────────────────────────────────
function getDB(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            // In production, log this instead of exposing details
            http_response_code(500);
            exit(json_encode([
                'success' => false,
                'error'   => 'Database connection failed.'
            ]));
        }
    }

    return $pdo;
}

// ── Shared JSON helper ────────────────────────────────────────
function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}
