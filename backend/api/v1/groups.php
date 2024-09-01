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

function saveImage($file, $type, $folder = "../uploads/groups/") {
    $targetDir = __DIR__ . '/' . $folder;
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $prefix = ($type == 'profile') ? 'groupProfile' : 'groupBanner';
    $filename = $prefix . uniqid(rand(), true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $targetFilePath = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        return "http://localhost/QueryQuorum/react_app/backend/api/uploads/groups/" . $filename;
    }

    return null;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $userId = $_POST['userId'];
        $groupName = "qq_" . $_POST['groupName'];
        $groupDescription = $_POST['groupDescription'];
        $groupRules = $_POST['groupRules'];
        $groupProfilePic = !empty($_FILES['groupProfilePic']) ? saveImage($_FILES['groupProfilePic'], 'profile') : null;
        $groupBannerPic = !empty($_FILES['groupBannerPic']) ? saveImage($_FILES['groupBannerPic'], 'banner') : null;

        try {
            $db->beginTransaction();

            $stmt = $db->prepare("INSERT INTO Groups (groupName, groupDescription, groupRules, groupProfilePic, groupBannerPic) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$groupName, $groupDescription, $groupRules, $groupProfilePic, $groupBannerPic]);
            $lastGroupId = $db->lastInsertId();

            $memberStmt = $db->prepare("INSERT INTO GroupMembers (userID, groupID, role, dateJoined) VALUES (?, ?, 'owner', NOW())");
            $memberStmt->execute([$userId, $lastGroupId]);

            $db->commit();

            echo json_encode(['message' => 'Group created successfully', 'groupId' => $lastGroupId]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(['message' => 'Failed to create group', 'error' => $e->getMessage()]);
            http_response_code(500);
        }
        break;

    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'getUserGroups' && isset($_GET['userId'])) {
            $userId = $_GET['userId'];
            $stmt = $db->prepare("SELECT g.groupID as id, g.groupName as name FROM Groups g JOIN GroupMembers gm ON g.groupID = gm.groupID WHERE gm.userID = ?");
            $stmt->execute([$userId]);
            $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($groups) {
                echo json_encode(['groups' => $groups]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'No groups found']);
            }
        } else
        if (isset($_GET['action']) && $_GET['action'] === 'getGroupDetails' && isset($_GET['groupId'])) {
            $groupId = $_GET['groupId'];
            $stmt = $db->prepare("SELECT * FROM Groups WHERE groupID = ?");
            $stmt->execute([$groupId]);
            $groupDetails = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($groupDetails) {
                echo json_encode($groupDetails);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Group not found']);
            }
        } else 
        if (isset($_GET['action']) && $_GET['action'] === 'getGroup' && isset($_GET['groupId'])) {
            $groupId = $_GET['groupId'];
            $stmt = $db->prepare("SELECT groupName FROM Groups WHERE groupID = ?");
            $stmt->execute([$groupId]);
            $group = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($group) {
                echo json_encode(['groupName' => $group['groupName']]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Group not found']);
            }
        } else 
        if (isset($_GET['action']) && $_GET['action'] === 'getGroupCount') {
            $query = "SELECT COUNT(*) AS totalGroups FROM Groups";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode($count);
        } else 
        if (isset($_GET['action']) && $_GET['action'] === 'getAllGroups') {
            $stmt = $db->prepare("SELECT * FROM Groups");
            $stmt->execute();
            $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($groups) {
                echo json_encode([$groups]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'No groups found']);
            }
        } else 
        if (isset($_GET['action']) && $_GET['action'] === 'getGroupMembersFromID' && isset($_GET['groupId'])) {
            $groupId = $_GET['groupId'];
            $stmt = $db->prepare("SELECT * FROM GroupMembers WHERE groupID = ?");
            $stmt->execute([$groupId]);
            $groupMembers = $stmt->fetchAll(PDO::FETCH_ASSOC); // Use fetchAll to get all rows

            if ($groupMembers) {
                echo json_encode($groupMembers); // No need to wrap $groupMembers in an array
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Group not found']);
            }
        }
  
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;

    
}
?>
