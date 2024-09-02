import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./postitem.css";

function PostItemLg({ post }) {
  const [userProfilePic, setUserProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [postRepliesLength, setPostRepliesLength] = useState("");
  const postViewsCount = post.postViews ? post.postViews : 0;
  const postLikesCount = post.postLikes ? post.postLikes : 0;
  const groupTargetURL = "/group?" + post.groupID;
  const postTargetURL = "/post?" + post.postID;
  const [postReplyCount, setPostReplyCount] = useState(0);

  useEffect(() => {
    if (post.postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getCommentCountByPostID&postID=${post.postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && !data.message) {
            // If there's no error message in the response
            setPostReplyCount(data.commentCount);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [post.postID]);
  // API call to users.php to fetch userProfilePic and userName using the userID
  // API call to groups.php to fetch groupname using the groupID
  useEffect(() => {
    if (post.groupID) {
      fetchGroupDetails(post.groupID);
    }
    if (post.userID) {
      fetchUserDetails(post.userID);
    }
  }, [post.groupID, post.userID]);

  const fetchGroupDetails = async (groupID) => {
    const response = await fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroup&groupId=${groupID}`
    );
    const data = await response.json();
    if (response.ok) {
      setGroupName(data.groupName);
    } else {
      console.error("Failed to fetch group details.");
    }
  };

  const fetchUserDetails = async (userID) => {
    const response = await fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=getUserDetails&userId=${userID}`
    );
    const data = await response.json();
    if (response.ok) {
      setUsername(data.username);
      setUserProfilePic(data.userProfilePic);
    } else {
      console.error("Failed to fetch user details.");
    }
  };

  return (
    <div className="postItemBody">
      <div className="postConentTop">
        <div className="postTopGroup">
          <div className="postUserProfile">
            <div
              className="postUserProfileImage"
              style={{ backgroundImage: `url(${userProfilePic})` }}
            ></div>
            {/* Display the username by getting the username using the userID */}
            <div className="postUserProfileName">{username}</div>
            <div className="postUserProfileName" style={{ marginLeft: "20px" }}>
              {post.postCreationDate}
            </div>
          </div>
        </div>
        <Link to={postTargetURL} style={{ textDecoration: "none" }}>
          <div className="postTitle">{post.postTitle}</div>
        </Link>

        <div className="postBottomGroup">
          <div className="postBottomGroupLeft">
            <div className="postRepliesGroup">
              <div className="postReplyIcon"></div>
              <div className="postReplyAmount">{postReplyCount} Relies</div>
            </div>
          </div>
          <div className="postBottomGroupRight">
            <div>{groupName}</div>
            <Link to={groupTargetURL} style={{ textDecoration: "none" }}>
              <button className="postViewgroup">View</button>
            </Link>
          </div>
        </div>
      </div>

      {post.postImage && (
        <div
          className="postImage"
          style={{ backgroundImage: `url(${post.postImage})` }}
        ></div>
      )}
    </div>
  );
}

export default PostItemLg;
