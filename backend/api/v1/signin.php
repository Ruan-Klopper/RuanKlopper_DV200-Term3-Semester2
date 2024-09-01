<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Allow your frontend domain
header('Access-Control-Allow-Credentials: true'); // To allow cookies to be sent
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

include_once '../config.php';
$db = getDB();

session_start(); // Start the session at the beginning of the script

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'];
    $password = $data['password'];

    $stmt = $db->prepare("SELECT userID, userPassword FROM Users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['userPassword'])) {
        // Set session variables
        $_SESSION['userId'] = $user['userID'];

        // Return success response
        echo json_encode(['message' => 'Sign in successful', 'userId' => $user['userID']]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['message' => 'Invalid credentials']);
    }
}
?>
