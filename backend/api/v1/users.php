<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

include_once '../config.php';
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 204 NO CONTENT');
    exit;
}

header('Content-Type: application/json');

function saveImage($file, $type, $folder = "../uploads/users/") {
    $targetDir = __DIR__ . '/' . $folder;
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $prefix = ($type == 'profile') ? 'userprofile' : 'userbanner';
    $filename = $prefix . uniqid(rand(), true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $targetFilePath = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        // Return full URL to the uploaded image
        return "http://localhost/QueryQuorum/react_app/backend/api/uploads/users/" . $filename;
    }

    return null;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    if (isset($_GET['action']) && $_GET['action'] === 'GETusernameBYid' && isset($_GET['userId'])) {
        $userId = $_GET['userId'];
        $stmt = $db->prepare("SELECT username, userProfilePic FROM Users WHERE userID = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    } else if (isset($_GET['action']) && $_GET['action'] === 'getUserDetails' && isset($_GET['userId'])) {
        $userId = $_GET['userId'];
        $stmt = $db->prepare("SELECT username, userProfilePic FROM Users WHERE userID = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode([
                'username' => $user['username'],
                'userProfilePic' => $user['userProfilePic'] // Directly use the path stored in the database
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    } else if (isset($_GET['action']) && $_GET['action'] === 'getFullUserDetails' && isset($_GET['userId'])) {
        $userId = $_GET['userId'];
        $stmt = $db->prepare("SELECT * FROM Users WHERE userID = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        }
    } else if (isset($_GET['action']) && $_GET['action'] === 'getUserCount') {
        $query = "SELECT COUNT(*) AS totalUsers FROM Users";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $count = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($count);
    }
    break;


        
    case 'POST':
        $username = $_POST['username'];
        $userFirstname = $_POST['userFirstname'];
        $userLastname = $_POST['userLastname'];
        $userBio = $_POST['userBio'];
        $userEmail = $_POST['userEmail'];
        $userPassword = password_hash($_POST['userPassword'], PASSWORD_DEFAULT);
        $userProfilePic = !empty($_FILES['userProfilePic']) ? saveImage($_FILES['userProfilePic'], 'profile') : null;
        $userBannerPic = !empty($_FILES['userBannerPic']) ? saveImage($_FILES['userBannerPic'], 'banner') : null;

        // Check for existing username
        $checkStmt = $db->prepare("SELECT username FROM Users WHERE username = ?");
        $checkStmt->execute([$username]);
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['message' => 'Username already exists']);
            http_response_code(409);
            exit;
        }

        $stmt = $db->prepare("INSERT INTO Users (username, userFirstname, userLastname, userBio, userEmail, userPassword, userProfilePic, userBannerPic, userActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)");
        $result = $stmt->execute([$username, $userFirstname, $userLastname, $userBio, $userEmail, $userPassword, $userProfilePic, $userBannerPic]);

        if ($result) {
            echo json_encode(['message' => 'User created successfully']);
        } else {
            echo json_encode(['message' => 'Failed to create user', 'error' => $stmt->errorInfo()]);
            http_response_code(500);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}
?>
