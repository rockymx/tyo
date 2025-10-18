<?php
/**
 * Configuration File
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database path
define('DB_PATH', __DIR__ . '/../db/database.db');

// Session configuration
define('SESSION_LIFETIME', 86400); // 24 hours in seconds

// Password requirements
define('MIN_PASSWORD_LENGTH', 6);

// Get database connection
function getDB() {
    try {
        $db = new PDO('sqlite:' . DB_PATH);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
