<?php
include 'config.php';  // Include the database configuration

header("Content-Type: application/json");

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/api/users':
        require __DIR__ . '/v1/users.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Resource not found']);
        break;
}
?>
