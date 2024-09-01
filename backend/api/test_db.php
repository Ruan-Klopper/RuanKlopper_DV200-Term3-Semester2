<?php
include 'config.php';  // Ensure the path to config.php is correct

try {
    $db = getDB();
    echo "Database connected successfully.<br>";

    // Handling user creation and file upload
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Upload image handling
        $profilePic = "";
        if (isset($_FILES["userProfilePic"])) {
            $targetDir = "uploads/";  
            $targetFile = $targetDir . time() . '_' . basename($_FILES["userProfilePic"]["name"]);
            if (move_uploaded_file($_FILES["userProfilePic"]["tmp_name"], $targetFile)) {
                echo "The file " . htmlspecialchars(basename($_FILES["userProfilePic"]["name"])) . " has been uploaded.<br>";
                $profilePic = $targetFile;  // Save this adjusted path in the database
            } else {
                echo "Sorry, there was an error uploading your file.<br>";
                error_log("Failed to move uploaded file for user: " . $_POST['username']);
            }
        }

        // Insert user information into database
        $stmt = $db->prepare("INSERT INTO Users (username, userFirstname, userLastname, userBio, userEmail, userPassword, userProfilePic, userActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $_POST['username'],
            $_POST['name'],
            $_POST['surname'],
            $_POST['bio'],
            $_POST['email'],
            password_hash($_POST['password'], PASSWORD_DEFAULT),  // Securely hashing the password
            $profilePic,
            1  // Assuming the user is active by default
        ]);

        if ($result) {
            echo "New user created successfully.<br>";
        } else {
            echo "Error creating user: " . implode(", ", $stmt->errorInfo()) . "<br>";
            error_log("SQL Error: " . implode(", ", $stmt->errorInfo()));
        }
    }

    // Query to fetch all users
    $stmt = $db->query("SELECT * FROM Users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($users) {
        echo "Listing all users:<br>";
        foreach ($users as $user) {
            echo "User ID: " . htmlspecialchars($user['userID']) . ", Username: " . htmlspecialchars($user['username']) . ", Email: " . htmlspecialchars($user['userEmail']) . "<br>";
            if (!empty($user['userProfilePic'])) {
                // Display image using the adjusted path
                echo "<img src='" . htmlspecialchars($user['userProfilePic']) . "' alt='Profile Picture' style='width:100px;'><br>";
            }
        }
    } else {
        echo "No users found.<br>";
    }

} catch (PDOException $e) {
    echo "Error connecting to the database: " . $e->getMessage();
    error_log("Database connection error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration and Image Upload</title>
</head>
<body>
    <h1>User Registration Form</h1>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" enctype="multipart/form-data">
        <label for="name">Name:</label>
        <input type="text" name="name" id="name" required><br>

        <label for="surname">Surname:</label>
        <input type="text" name="surname" id="surname" required><br>

        <label for="username">Username:</label>
        <input type="text" name="username" id="username" required><br>

        <label for="bio">Bio:</label>
        <textarea name="bio" id="bio"></textarea><br>

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" required><br>

        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required><br>

        Select profile picture to upload:
        <input type="file" name="userProfilePic" id="userProfilePic"><br>

        <input type="submit" value="Register User">
    </form>
</body>
</html>
