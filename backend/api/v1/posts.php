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

function saveImage($file, $folder = "../uploads/posts/") {
    $targetDir = __DIR__ . '/' . $folder;
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $filename = uniqid('post_') . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $targetFilePath = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        return "http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/uploads/posts/" . $filename; // Return full URL for accessing the image
    }

    return null; // Return null if the upload failed
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'getAllPosts') {
            $query = "SELECT * FROM Posts ORDER BY postCreationDate DESC"; // Orders the posts from newest to oldest
            $stmt = $db->prepare($query);
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($posts) {
                echo json_encode($posts);
            } else {
                echo json_encode(['message' => 'No posts found']);
            }
        } else if (isset($_GET['action']) && $_GET['action'] === 'getPostCount') {
            $query = "SELECT COUNT(*) AS totalPosts FROM Posts";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($count);
        } else if (isset($_GET['action']) && $_GET['action'] === 'getPostById' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];
            $query = "SELECT * FROM Posts WHERE postID = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$postID]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                echo json_encode($post);
            } else {
                echo json_encode(['message' => 'Post not found']);
            }
        } else if (isset($_GET['action']) && $_GET['action'] === 'getPostsByGroupID' && isset($_GET['groupID'])) {
            $groupID = $_GET['groupID'];
            $query = "SELECT * FROM Posts WHERE groupID = ? ORDER BY postCreationDate DESC";
            $stmt = $db->prepare($query);
            $stmt->execute([$groupID]);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($posts) {
                echo json_encode($posts);
            } else {
                echo json_encode(['message' => 'No posts found for this group']);
            }
        } else if (isset($_GET['action']) && $_GET['action'] === 'incrementPostViews' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];
            $query = "UPDATE Posts SET postViews = postViews + 1 WHERE postID = ?";
            $stmt = $db->prepare($query);
            if ($stmt->execute([$postID])) {
                echo json_encode(['message' => 'Post views incremented']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to increment post views']);
            }
        } else if (isset($_GET['action']) && $_GET['action'] === 'incrementPostLikes' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];
            $query = "UPDATE Posts SET postLikes = postLikes + 1 WHERE postID = ?";
            $stmt = $db->prepare($query);
            if ($stmt->execute([$postID])) {
                echo json_encode(['message' => 'Post likes incremented']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to increment post likes']);
            }
        }

        break;

        
    case 'POST':
        $userId = $_POST['userId']; // Should ideally be fetched securely from session
        $groupId = $_POST['groupId']; // Passed from form data
        $title = $_POST['title'];
        $content = $_POST['content'];
        $image = !empty($_FILES['image']) ? saveImage($_FILES['image']) : null;

        try {
            $stmt = $db->prepare("INSERT INTO Posts (userID, groupID, postTitle, postDescription, postImage, postCreationDate) VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$userId, $groupId, $title, $content, $image]);
            echo json_encode(['message' => 'Post created successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create post', 'error' => $e->getMessage()]);
        }
        break;

        // When url called, must increment the postViews with one
        // When url called, must increment the postLikes with one
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}
?>
