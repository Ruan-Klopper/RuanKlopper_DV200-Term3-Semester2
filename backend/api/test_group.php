<?php
include 'config.php';  // Ensure the path to config.php is correct

try {
    $db = getDB();
    echo "Database connected successfully.<br>";

    // Handling group creation and banner image upload
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Transaction begins
        $db->beginTransaction();

        // Upload image handling
        $bannerPic = "";
        if (isset($_FILES["groupBannerPic"])) {
            $targetDir = "uploads/groups/";  
            $targetFile = $targetDir . time() . '_' . basename($_FILES["groupBannerPic"]["name"]);
            if (move_uploaded_file($_FILES["groupBannerPic"]["tmp_name"], $targetFile)) {
                echo "The file " . htmlspecialchars(basename($_FILES["groupBannerPic"]["name"])) . " has been uploaded.<br>";
                $bannerPic = $targetFile;  // Save this adjusted path in the database
            } else {
                echo "Sorry, there was an error uploading your file.<br>";
                error_log("Failed to move uploaded file for group: " . $_POST['groupName']);
            }
        }

        // Insert new group with the uploaded banner image path
        $stmt = $db->prepare("INSERT INTO Groups (groupName, groupDescription, groupRules, groupProfilePic, groupBannerPic, groupViews) VALUES (?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $_POST['groupName'],
            $_POST['groupDescription'],
            $_POST['groupRules'],
            $_POST['groupProfilePic'],  // Assuming a URL is still manually entered for the profile pic
            $bannerPic,
            $_POST['groupViews']
        ]);

        if ($result) {
            $lastGroupId = $db->lastInsertId();
            echo "New group created successfully. Group ID: $lastGroupId<br>";

            // Insert into GroupMembers
            $stmt = $db->prepare("INSERT INTO GroupMembers (userID, groupID, role, dateJoined) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $_POST['userID'],
                $lastGroupId,
                'owner',
                date('Y-m-d')
            ]);
            
            echo "Group member added successfully.<br>";

            // Commit transaction
            $db->commit();
        } else {
            echo "Error creating group: " . implode(", ", $stmt->errorInfo()) . "<br>";
            $db->rollBack();
        }
    }

    // Query to fetch all groups
    $stmt = $db->query("SELECT * FROM Groups");
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($groups) {
        echo "Listing all groups:<br>";
        foreach ($groups as $group) {
            echo "Group ID: " . htmlspecialchars($group['groupID']) . ", Group Name: " . htmlspecialchars($group['groupName']) . "<br>";
            if (!empty($group['groupBannerPic'])) {
                // Display banner image using the adjusted path
                echo "<img src='" . htmlspecialchars($group['groupBannerPic']) . "' alt='Banner Picture' style='width:300px;'><br>";
            }
        }
    } else {
        echo "No groups found.<br>";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    $db->rollBack();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Group</title>
</head>
<body>
    <h1>Create New Group</h1>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" enctype="multipart/form-data">
        <label for="groupName">Group Name:</label>
        <input type="text" name="groupName" id="groupName" required><br>

        <label for="groupDescription">Group Description:</label>
        <textarea name="groupDescription" id="groupDescription" required></textarea><br>

        <label for="groupRules">Group Rules:</label>
        <textarea name="groupRules" id="groupRules" required></textarea><br>

        <label for="groupProfilePic">Profile Picture URL:</label>
        <input type="text" name="groupProfilePic" id="groupProfilePic" required><br>

        <label for="groupBannerPic">Banner Picture to Upload:</label>
        <input type="file" name="groupBannerPic" id="groupBannerPic" required><br>

        <label for="groupViews">Group Views:</label>
        <input type="number" name="groupViews" id="groupViews" required><br>

        <label for="userID">User ID (Owner):</label>
        <input type="number" name="userID" id="userID" required><br>

        <input type="submit" value="Create Group">
    </form>
</body>
</html>
