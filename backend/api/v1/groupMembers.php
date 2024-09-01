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
        if (isset($_GET['action']) && $_GET['action'] === 'addGroupMember' && isset($_GET['groupID']) && isset($_GET['userID'])) {
            // Add groupMember
            $groupID = $_GET['groupID'];
            $userID = $_GET['userID'];
            $role = isset($_GET['role']) ? $_GET['role'] : 'member';
            $dateJoined = date('Y-m-d');

            $stmt = $db->prepare("INSERT INTO GroupMembers (groupID, userID, role, dateJoined) VALUES (:groupID, :userID, :role, :dateJoined)");
            $stmt->bindParam(':groupID', $groupID);
            $stmt->bindParam(':userID', $userID);
            $stmt->bindParam(':role', $role);
            $stmt->bindParam(':dateJoined', $dateJoined);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['message' => 'Group member added successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to add group member']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input for POST request']);
        }
        break;

    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'checkUserInGroup' && isset($_GET['groupID']) && isset($_GET['userID'])) {
            // Check if a specific userID is in a groupID
            $groupID = $_GET['groupID'];
            $userID = $_GET['userID'];

            $stmt = $db->prepare("SELECT COUNT(*) FROM GroupMembers WHERE groupID = :groupID AND userID = :userID");
            $stmt->bindParam(':groupID', $groupID);
            $stmt->bindParam(':userID', $userID);
            $stmt->execute();

            $count = $stmt->fetchColumn();

            echo json_encode(['exists' => $count > 0]);
        } else if (isset($_GET['action']) && $_GET['action'] === 'getGroupMembers' && isset($_GET['groupID'])) {
            // Example: Get all members of a specific group
            $groupID = $_GET['groupID'];

            $stmt = $db->prepare("SELECT * FROM GroupMembers WHERE groupID = :groupID");
            $stmt->bindParam(':groupID', $groupID);
            $stmt->execute();

            $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($members);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input for GET request']);
        }
        break;

    case 'PUT':
        if (isset($_GET['action']) && $_GET['action'] === 'updateUserRole' && isset($_GET['groupID']) && isset($_GET['userID'])) {
            // Update a groupRole to admin from member
            $groupID = $_GET['groupID'];
            $userID = $_GET['userID'];

            // First, check if the user is already an admin
            $stmt = $db->prepare("SELECT role FROM GroupMembers WHERE groupID = :groupID AND userID = :userID");
            $stmt->bindParam(':groupID', $groupID);
            $stmt->bindParam(':userID', $userID);
            $stmt->execute();

            $role = $stmt->fetchColumn();

            if ($role === 'admin') {
                http_response_code(400);
                echo json_encode(['message' => 'User is already an admin']);
            } else {
                // Update the role to admin
                $stmt = $db->prepare("UPDATE GroupMembers SET role = 'admin' WHERE groupID = :groupID AND userID = :userID");
                $stmt->bindParam(':groupID', $groupID);
                $stmt->bindParam(':userID', $userID);

                if ($stmt->execute()) {
                    echo json_encode(['message' => 'User role updated to admin']);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Failed to update user role']);
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input for PUT request']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['action']) && $_GET['action'] === 'deleteGroupMember' && isset($_GET['groupID']) && isset($_GET['userID'])) {
            // Delete a groupMember
            $groupID = $_GET['groupID'];
            $userID = $_GET['userID'];

            $stmt = $db->prepare("DELETE FROM GroupMembers WHERE groupID = :groupID AND userID = :userID");
            $stmt->bindParam(':groupID', $groupID);
            $stmt->bindParam(':userID', $userID);

            if ($stmt->execute()) {
                echo json_encode(['message' => 'Group member deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to delete group member']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input for DELETE request']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}
?>
