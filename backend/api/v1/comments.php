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

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (isset($input['postID'], $input['userID'], $input['commentText'])) {
            $postID = $input['postID'];
            $userID = $input['userID'];
            $commentText = $input['commentText'];
            $parentCommentID = isset($input['parentCommentID']) ? $input['parentCommentID'] : null;

            $query = "INSERT INTO Comments (postID, userID, parentCommentID, commentText, commentCreationDate)
                      VALUES (:postID, :userID, :parentCommentID, :commentText, NOW())";
            $stmt = $db->prepare($query);

            $stmt->bindParam(':postID', $postID);
            $stmt->bindParam(':userID', $userID);
            $stmt->bindParam(':parentCommentID', $parentCommentID);
            $stmt->bindParam(':commentText', $commentText);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['message' => 'Comment added successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to add comment']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required parameters']);
        }
        break;

    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'getAllCommentsByPostID' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];

            $query = "SELECT * FROM Comments WHERE postID = ? ORDER BY commentCreationDate ASC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $postID, PDO::PARAM_INT);
            $stmt->execute();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($comments);

        } else if (isset($_GET['action']) && $_GET['action'] === 'getAllCommentExcludeParent' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];

            $query = "SELECT * FROM Comments WHERE postID = ? AND parentCommentID IS NULL ORDER BY commentCreationDate ASC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $postID, PDO::PARAM_INT);
            $stmt->execute();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($comments);
            
        } else if (isset($_GET['action']) && $_GET['action'] === 'getChildComments' && isset($_GET['postID']) && isset($_GET['parentCommentID'])) {
            $postID = $_GET['postID'];
            $parentCommentID = $_GET['parentCommentID'];

            $query = "SELECT * FROM Comments WHERE postID = ? AND parentCommentID = ? ORDER BY commentCreationDate ASC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $postID, PDO::PARAM_INT);
            $stmt->bindParam(2, $parentCommentID, PDO::PARAM_INT);
            $stmt->execute();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($comments);

        } else if (isset($_GET['action']) && $_GET['action'] === 'getCommentCountByPostID' && isset($_GET['postID'])) {
            $postID = $_GET['postID'];

            $query = "SELECT COUNT(*) AS commentCount FROM Comments WHERE postID = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $postID, PDO::PARAM_INT);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($count) {
                echo json_encode(['commentCount' => $count['commentCount']]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'No comments found for this post']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid request']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}
?>
