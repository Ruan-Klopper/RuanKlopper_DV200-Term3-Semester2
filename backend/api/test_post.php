<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "QueryQuorum"; // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to display all posts
function displayPosts($conn) {
    $sql = "SELECT postTitle, postDescription, postImage, postCreationDate FROM Posts";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<h2>All Posts</h2>";
        while ($row = $result->fetch_assoc()) {
            echo "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;'>";
            echo "<h3>" . htmlspecialchars($row['postTitle']) . "</h3>";
            echo "<p>" . htmlspecialchars($row['postDescription']) . "</p>";
            if ($row['postImage']) {
                echo "<img src='/uploads/posts/" . htmlspecialchars($row['postImage']) . "' alt='Post Image' style='max-width: 200px;'/>";
            }
            echo "<p>Posted on: " . htmlspecialchars($row['postCreationDate']) . "</p>";
            echo "</div>";
        }
    } else {
        echo "No posts available.";
    }
}

// Handling post submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $postTitle = $_POST['postTitle'];
    $postDescription = $_POST['postDescription'];
    $postImage = "";

    // Handling file upload
    if (isset($_FILES['postImage']) && $_FILES['postImage']['error'] == 0) {
        $target_dir = "uploads/posts/"; // Making sure the directory matches the users.php structure
        $target_file = $target_dir . basename($_FILES["postImage"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Check if the file is an actual image
        $check = getimagesize($_FILES["postImage"]["tmp_name"]);
        if ($check !== false) {
            if (move_uploaded_file($_FILES["postImage"]["tmp_name"], $target_file)) {
                $postImage = basename($_FILES["postImage"]["name"]);
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        } else {
            echo "File is not an image.";
        }
    }

    // Insert into database
    $sql = "INSERT INTO Posts (postTitle, postDescription, postImage, postCreationDate) VALUES ('$postTitle', '$postDescription', '$postImage', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo "New post created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Posts</title>
</head>
<body>

<h1>Create a New Post</h1>
<form action="test_post.php" method="post" enctype="multipart/form-data">
    <label for="postTitle">Post Title:</label><br>
    <input type="text" id="postTitle" name="postTitle" required><br><br>

    <label for="postDescription">Post Description:</label><br>
    <textarea id="postDescription" name="postDescription" required></textarea><br><br>

    <label for="postImage">Post Image:</label><br>
    <input type="file" id="postImage" name="postImage"><br><br>

    <input type="submit" value="Submit">
</form>

<hr>

<?php
// Re-establish connection to display posts
$conn = new mysqli($servername, $username, $password, $dbname);
displayPosts($conn);
?>

</body>
</html>
