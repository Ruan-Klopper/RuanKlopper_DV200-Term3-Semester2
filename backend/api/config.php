<?php
// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'QueryQuorum');
define('DB_USER', 'root');
define('DB_PASSWORD', '');

// PDO options for error handling and connection persistence
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::ATTR_PERSISTENT         => true
];

function getDB() {
    static $db = null;
    if ($db === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        try {
            $db = new PDO($dsn, DB_USER, DB_PASSWORD, $GLOBALS['options']);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    return $db;
}
?>
