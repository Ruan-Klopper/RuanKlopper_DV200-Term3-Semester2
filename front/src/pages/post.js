import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./global.css";
import "./post.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import NotLoggedIn from "../compoments/NotLoggedIn";

const MemberItem = ({ userID }) => {
  const UserID = userID;
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (UserID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=getFullUserDetails&userId=${UserID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post user:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setUser(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [UserID]);

  return (
    <div className="groupMemberItemBody">
      <div
        className="groupMemberItemImg"
        style={{ backgroundImage: `url(${user.userProfilePic})` }}
      ></div>
      <div className="groupMemberItemName">{user.username}</div>
    </div>
  );
};

const MainPost = ({
  userProfilePic,
  userName,
  postCreationDate,
  postTitle,
  postDescription,
  postImage,
  postID,
}) => {
  const [postReplyCount, setPostReplyCount] = useState(0);

  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getCommentCountByPostID&postID=${postID}`
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
  }, [postID]);
  return (
    <>
      <div className="mainPostBody">
        <div className="mainPostTopGroup">
          <div
            className="mainPostUserProfilePic"
            style={{ backgroundImage: `url(${userProfilePic})` }}
          ></div>
          <div className="mainPostUserProfileName">{userName}</div>
          <div className="mainPostCreationDate">{postCreationDate}</div>
        </div>
        <div className="mainPostTitle">{postTitle}</div>
        <div className="mainPostDescription">{postDescription}</div>
        {postImage && (
          <div
            className="mainPostImage"
            style={{ backgroundImage: `url(${postImage})` }}
          ></div>
        )}
        <div className="mainPostBottomGroup">
          <div style={{ display: "flex" }}>
            <button className="mainPostComments">
              <div className="mainPostCommentsIcon"></div>
              <div>{postReplyCount}</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const PostComment = ({ comment, addReply, postid }) => {
  const [user, setUser] = useState([]);
  const [childComments, setChildComments] = useState([]);
  const [showAddCommentBox, setShowAddCommentBox] = useState(false);
  const {
    commentCreationDate,
    commentText,
    commentLikes,
    userID,
    commentID,
    postID,
  } = comment;
  const activeUserID = sessionStorage.getItem("userId");

  // Get the user information for the comment
  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=getFullUserDetails&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && !data.message) {
            setUser(data);
          } else {
            console.error(data.message || "User not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userID]); // Corrected dependency to userID

  // Fetch all of the child comment
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getChildComments&postID=${postID}&parentCommentID=${commentID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("ALL CHILD COMMENTS FETCHED", data);
          if (data && !data.message) {
            setChildComments(data);
          } else {
            console.error(data.message || "Comment not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching child comments data:", error);
        });
    }
  }, [postID]);

  // Get all of the replies for the comment
  const fetchChildComments = () => {
    if (postID && commentID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getChildComments&postID=${postID}&parentCommentID=${commentID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Child comments:", data);
          if (data && !data.message) {
            setChildComments(data);
          } else {
            console.error(data.message || "Child comments not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching child comments:", error);
        });
    }
  };

  const handleToggleAddCommentBox = () => {
    setShowAddCommentBox(true);
  };

  const handleCloseAddCommentBox = () => {
    setShowAddCommentBox(false);
  };

  const AddCommentBox = () => {
    const [commentText, setCommentText] = useState("");

    // Add a reply for this comment, using this commentID to input as parentCommentID
    const handleAddComment = async () => {
      if (commentText && activeUserID) {
        try {
          const response = await fetch(
            `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                postID: postID,
                userID: activeUserID,
                commentText: commentText,
                parentCommentID: commentID,
              }),
            }
          );

          const result = await response.json();
          if (response.ok) {
            // Re-fetch comments after adding a new one
            fetchChildComments();
            setShowAddCommentBox(false); // Corrected to setShowAddCommentBox(false)
          } else {
            alert("Failed to add comment: " + result.message);
          }
        } catch (error) {
          alert("Error submitting comment: " + error.message);
        }
      } else {
        console.error("Cant submit a blank comment or no user is valid");
      }
    };

    return (
      <div className="addCommentBody">
        <textarea
          className="addCommentInput"
          placeholder="Type here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className="addCommentSplitter"></div>
        <div className="addCommentBTNgroup">
          {/* When comment or canceled is clicked, it should close the AddCommentBox */}
          <button
            className="addCommentCancel"
            onClick={handleCloseAddCommentBox}
          >
            Cancel
          </button>
          <button className="addCommentAdd" onClick={handleAddComment}>
            Comment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="commentBody">
      <div>
        <div className="commentWrapper">
          <div className="commentTopGroup">
            <div
              className="commentUserImg"
              style={{ backgroundImage: `url(${user.userProfilePic})` }}
            ></div>
            <div className="commentUserName">{user.username}</div>
            <div className="commentDateAdded">{commentCreationDate}</div>
          </div>
          <div className="commentContent">{commentText}</div>
          <div className="commentBottomGroup">
            <button
              className="mainPostComments"
              onClick={handleToggleAddCommentBox}
            >
              <div className="mainPostCommentsIcon"></div>
              <div>{childComments.length} Replies</div>
            </button>
          </div>
        </div>

        <div className="commentAddContainer">
          {/* Inside this div tag, <AddCommentBox/> gets toggled by "mainPostComments" button */}
          {showAddCommentBox && <AddCommentBox />}
        </div>

        {/* Replies should always be shown here */}
        <div className="commentReply">
          <div className="commentSideStripe"></div>
          <div className="commentReplyContainer">
            {childComments.map((reply) => (
              <div className="commentBodyChild">
                <PostComment
                  key={reply.commentID}
                  comment={reply}
                  addReply={addReply}
                  postid={postid}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoggedInContent = (userid) => {
  // Get the selected post to view from the url post?(postID
  const location = useLocation();
  const query = location.search;
  const postID = query.substring(1);
  console.log("Current page:" + postID);

  const [post, setPost] = useState([]);
  const postCreationDate = post.postCreationDate;
  const date = new Date(postCreationDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const postCreation = date.toLocaleDateString("en-GB", options);
  const postViewsCount = post.postViews ? post.postViews : 0;
  const postLikesCount = post.postLikes ? post.postLikes : 0;

  const groupID = post.groupID;
  const [group, setGroup] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const userID = post.userID;
  const [user, setUser] = useState([]);

  const currentUserID = userid;
  console.log("Active user:", userid);

  // Get all comments using the postID
  const [allComments, setAllComments] = useState([]);
  // Get all comments using the postID and Comments that dont have parentCommentID
  const [parentComments, setAllParentComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [userJoined, setUserJoined] = useState(false);

  // Get post information by postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=getPostById&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setPost(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Add view for when the user has landed on the page
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=incrementPostViews&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("POST VIEWS:", data);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Get group information by post.groupID
  useEffect(() => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupDetails&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post group:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroup(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [groupID]);

  // Get all group member id tags
  useEffect(() => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupMembersFromID&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post groupMembers:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroupMembers(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [groupID]);

  // Get user information by post.userID
  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=getFullUserDetails&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post user:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setUser(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [userID]);

  // Check if the current user is a member of the group
  useEffect(() => {
    if (currentUserID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groupMembers.php?action=checkUserInGroup&groupID=${groupID}&userID=${currentUserID.userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Is the user in the group?:", data);
          console.log("currentUserID:", currentUserID);
          console.log("groupId:", groupID);
          if (data && !data.message) {
            // If there's no error message in the response
            setUserJoined(data.exists);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    } else {
      console.log("/nUser not logged in/n");
    }
  }, [groupID]);

  // Get all comments by post.postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentsByPostID&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All parent comments for this post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setAllParentComments(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Get all comments without parentCommentID by post.postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentExcludeParent&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All comments for this post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setAllParentComments(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Add a comment to the post, this is only for the main "parent comments" that don't have a parent comment ID
  const handleAddComment = async (text) => {
    if (text && currentUserID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postID: postID,
              userID: currentUserID.userID,
              commentText: text,
            }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          // Re-fetch comments after adding a new one
          fetchAllParentComments();
        } else {
          alert("Failed to add comment: " + result.message);
        }
      } catch (error) {
        alert("Error submitting comment: " + error.message);
      }
    }
  };

  // Function to fetch all parent comments
  const fetchAllParentComments = async () => {
    if (postID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentExcludeParent&postID=${postID}`
        );
        const data = await response.json();
        if (response.ok && data) {
          setAllParentComments(data);
        } else {
          console.error(data.message || "Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  // User joined group
  const handleJoinGroup = async (e) => {
    e.preventDefault();

    if (!userJoined && currentUserID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groupMembers.php?action=addGroupMember&groupID=${groupID}&userID=${currentUserID.userID}&role=member`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        console.log(result); // Log the response from the server
        if (response.ok) {
          alert("User registered successfully");
          setUserJoined(true); // Update the state to reflect the user has joined
          fetchGroupMembers();
        } else {
          alert("Failed to add user to the group: " + result.message);
        }
      } catch (error) {
        alert("Error submitting data: " + error.message);
      }
    }
  };

  const fetchGroupMembers = () => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupMembersFromID&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post groupMembers:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroupMembers(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  };

  // Get all group member id tags
  useEffect(() => {
    fetchGroupMembers(); // Call this function to fetch the comments when the component mounts or when parentComments changes
  }, [groupID]);

  return (
    <>
      <div className="postPageRoot">
        <div className="postPageContent">
          <div className="postPageContentLeft">
            <MainPost
              userProfilePic={user.userProfilePic}
              userName={user.username}
              postTitle={post.postTitle}
              postCreationDate={postCreation}
              postDescription={post.postDescription}
              postImage={post.postImage}
              postLikes={post.postLikes}
              postComments={"4"}
              postSaves={"25"}
              postID={postID}
            />
            <h3 className="postPageAddCommentTop">Add a cooment</h3>
            {/* Add comments to the post, this comments that are being added doesnt have a parent, because this comment is the parent for all future replies to it */}
            <div className="addCommentBody">
              <textarea
                className="addCommentInput"
                placeholder="Type here..."
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <div className="addCommentSplitter"></div>
              <div className="addCommentBTNgroup">
                <button
                  className="addCommentCancel"
                  onClick={() => setCommentText("")}
                >
                  Cancel
                </button>
                <button
                  className="addCommentAdd"
                  onClick={() => handleAddComment(commentText)}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
          <div className="groupPageContentRight">
            <div className="groupDetailsBody">
              <div
                className="groupDetailsImage"
                style={{ backgroundImage: `url(${group.groupBannerPic})` }}
              >
                <div className="groupDetailsImageOverlay">
                  <div className="groupDetailsName">{group.groupName}</div>

                  {/* If userJoined is true then change the buttons text to Joined, if not set the button text to JOin */}
                  <button
                    className="postGroupDetailsJoinBtn"
                    onClick={handleJoinGroup}
                  >
                    {userJoined ? "Joined" : "Join"}
                  </button>
                </div>
              </div>
              <div className="groupDetailsContent">
                <div className="groupDetailsContentText">
                  {group.groupDescription}
                </div>
                <div className="groupDetailsContentText">
                  {group.groupRules}
                </div>
              </div>
            </div>
            <div className="groupDetailsMembersBody">
              <h4>Group members</h4>
              <div className="groupDetailsMembersContainer">
                {groupMembers.map((groupMember) => (
                  <MemberItem
                    key={groupMember.userID}
                    userID={groupMember.userID}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Width same as combined items above */}
        </div>
        <div className="postPageComments">
          <h3 className="commentsHeaderH3">Answers</h3>
          {/* All of the comments go here */}
          {parentComments.map((parentComment) => (
            <div className="commentBodyParent">
              <PostComment
                key={parentComment.commentID}
                comment={parentComment}
                currentUserID={currentUserID}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const LoggedOutContent = (userid) => {
  // Get the selected post to view from the url post?(postID
  const location = useLocation();
  const query = location.search;
  const postID = query.substring(1);
  console.log("Current page:" + postID);

  const [post, setPost] = useState([]);
  const postCreationDate = post.postCreationDate;
  const date = new Date(postCreationDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const postCreation = date.toLocaleDateString("en-GB", options);
  const postViewsCount = post.postViews ? post.postViews : 0;
  const postLikesCount = post.postLikes ? post.postLikes : 0;

  const groupID = post.groupID;
  const [group, setGroup] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const userID = post.userID;
  const [user, setUser] = useState([]);

  const currentUserID = userid;
  console.log("Active user:", userid);

  // Get all comments using the postID
  const [allComments, setAllComments] = useState([]);
  // Get all comments using the postID and Comments that dont have parentCommentID
  const [parentComments, setAllParentComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [userJoined, setUserJoined] = useState(false);

  // Get post information by postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=getPostById&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setPost(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Add view for when the user has landed on the page
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=incrementPostViews&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("POST VIEWS:", data);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Get group information by post.groupID
  useEffect(() => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupDetails&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post group:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroup(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [groupID]);

  // Get all group member id tags
  useEffect(() => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupMembersFromID&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post groupMembers:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroupMembers(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [groupID]);

  // Get user information by post.userID
  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=getFullUserDetails&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post user:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setUser(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [userID]);

  // Check if the current user is a member of the group
  useEffect(() => {
    if (currentUserID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groupMembers.php?action=checkUserInGroup&groupID=${groupID}&userID=${currentUserID.userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Is the user in the group?:", data);
          console.log("currentUserID:", currentUserID);
          console.log("groupId:", groupID);
          if (data && !data.message) {
            // If there's no error message in the response
            setUserJoined(data.exists);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    } else {
      console.log("/nUser not logged in/n");
    }
  }, [groupID]);

  // Get all comments by post.postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentsByPostID&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All parent comments for this post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setAllParentComments(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Get all comments without parentCommentID by post.postID
  useEffect(() => {
    if (postID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentExcludeParent&postID=${postID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All comments for this post:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setAllParentComments(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [postID]);

  // Add a comment to the post, this is only for the main "parent comments" that don't have a parent comment ID
  const handleAddComment = async (text) => {
    if (text && currentUserID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postID: postID,
              userID: currentUserID.userID,
              commentText: text,
            }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          // Re-fetch comments after adding a new one
          fetchAllParentComments();
        } else {
          alert("Failed to add comment: " + result.message);
        }
      } catch (error) {
        alert("Error submitting comment: " + error.message);
      }
    }
  };

  // Function to fetch all parent comments
  const fetchAllParentComments = async () => {
    if (postID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/comments.php?action=getAllCommentExcludeParent&postID=${postID}`
        );
        const data = await response.json();
        if (response.ok && data) {
          setAllParentComments(data);
        } else {
          console.error(data.message || "Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  // User joined group
  const handleJoinGroup = async (e) => {
    e.preventDefault();

    if (!userJoined && currentUserID) {
      try {
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groupMembers.php?action=addGroupMember&groupID=${groupID}&userID=${currentUserID.userID}&role=member`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        console.log(result); // Log the response from the server
        if (response.ok) {
          alert("User registered successfully");
          setUserJoined(true); // Update the state to reflect the user has joined
          fetchGroupMembers();
        } else {
          alert("Failed to add user to the group: " + result.message);
        }
      } catch (error) {
        alert("Error submitting data: " + error.message);
      }
    }
  };

  const fetchGroupMembers = () => {
    if (groupID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupMembersFromID&groupId=${groupID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched post groupMembers:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroupMembers(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  };

  // Get all group member id tags
  useEffect(() => {
    fetchGroupMembers(); // Call this function to fetch the comments when the component mounts or when parentComments changes
  }, [groupID]);

  return (
    <>
      <div className="postPageRoot">
        <div className="postPageContent">
          <div className="postPageContentLeft">
            <MainPost
              userProfilePic={user.userProfilePic}
              userName={user.username}
              postTitle={post.postTitle}
              postCreationDate={postCreation}
              postDescription={post.postDescription}
              postImage={post.postImage}
              postLikes={post.postLikes}
              postComments={"4"}
              postSaves={"25"}
              postID={postID}
            />
            <h3 className="postPageAddCommentTop">
              Please login or signup to comment
            </h3>
          </div>
          <div className="groupPageContentRight">
            <div className="groupDetailsBody">
              <div
                className="groupDetailsImage"
                style={{ backgroundImage: `url(${group.groupBannerPic})` }}
              >
                <div className="groupDetailsImageOverlay">
                  <div className="groupDetailsName">{group.groupName}</div>

                  {/* If userJoined is true then change the buttons text to Joined, if not set the button text to JOin */}
                  <button
                    className="postGroupDetailsJoinBtn"
                    onClick={handleJoinGroup}
                  >
                    {userJoined ? "Joined" : "Join"}
                  </button>
                </div>
              </div>
              <div className="groupDetailsContent">
                <div className="groupDetailsContentText">
                  {group.groupDescription}
                </div>
                <div className="groupDetailsContentText">
                  {group.groupRules}
                </div>
              </div>
            </div>
            <div className="groupDetailsMembersBody">
              <h4>Group members</h4>
              <div className="groupDetailsMembersContainer">
                {groupMembers.map((groupMember) => (
                  <MemberItem
                    key={groupMember.userID}
                    userID={groupMember.userID}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Width same as combined items above */}
        </div>
        <div className="postPageComments">
          <h3 className="commentsHeaderH3">Answers</h3>
          {/* All of the comments go here */}
          {parentComments.map((parentComment) => (
            <div className="commentBodyParent">
              <PostComment
                key={parentComment.commentID}
                comment={parentComment}
                currentUserID={currentUserID}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

function Post() {
  const [sessionUserID, setSessionUserID] = useState("");
  const userId = sessionStorage.getItem("userId");
  useEffect(() => {
    setSessionUserID(userId);
  }, []);

  return (
    <div className="website">
      <div className="NavBarWrapper">
        <NavBar />
      </div>
      <div className="WebsiteContent">
        <div>
          <SideNav currentPage={"Group: arduino"} />
        </div>
        <div className="WebsiteRoot">
          {sessionUserID ? (
            <LoggedInContent userID={sessionUserID} />
          ) : (
            <LoggedOutContent userID={sessionUserID} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
