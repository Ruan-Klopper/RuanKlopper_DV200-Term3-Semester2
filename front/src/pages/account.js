import "./global.css";
import "./account.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import NotLoggedIn from "../compoments/NotLoggedIn";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PostTab = ({ userID }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=getPostsByUserID&userID=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All posts created by user:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setPosts(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [userID]);

  const getAllPostItems = () => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=getPostsByUserID&userID=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("All posts created by user:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setPosts(data);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  };

  const handleDeletePostItem = async (postid) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        console.log("The post being deleted:", postid);
        const response = await fetch(
          `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/posts.php?action=deletePost&postID=${postid}`,
          {
            method: "DELETE",
          }
        );

        // Ensure the response is actually JSON
        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          getAllPostItems(); // Refresh the list of posts after deletion
        } else {
          alert("Failed to delete post: " + result.message);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("An error occurred while trying to delete the post.");
      }
    }
  };

  function PostTabItem({ post }) {
    const [userProfilePic, setUserProfilePic] = useState("");
    const [username, setUsername] = useState("");
    const [groupName, setGroupName] = useState("");
    const [postRepliesLength, setPostRepliesLength] = useState("");
    const postViewsCount = post.postViews ? post.postViews : 0;
    const postLikesCount = post.postLikes ? post.postLikes : 0;
    const groupTargetURL = "/group?" + post.groupID;
    const postTargetURL = "/post?" + post.postID;
    const postid = post.postID;
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
              <div
                className="postUserProfileName"
                style={{ marginLeft: "20px" }}
              >
                {post.postCreationDate}
              </div>
            </div>
            <div>
              <button
                className="postDeleteButton"
                onClick={() => handleDeletePostItem(post.postID)}
              >
                Delete
              </button>
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

  return (
    <div className="accountTabPostContainer">
      {posts.map((post) => (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <PostTabItem key={post.postID} post={post} />
          </div>
        </div>
      ))}
    </div>
  );
};

const GroupsTab = ({ userID }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php?action=getGroupsByUserID&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Groups the user is currently in:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setGroups(data.groups);
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [userID]);

  const GroupTabItem = ({ group }) => {
    return (
      <div className="accGroupTabBody">
        <div
          className="accGroupTabBackground"
          style={{ backgroundImage: `url(${group.groupBannerPic})` }}
        >
          <div className="accGroupTabBgOverlay">
            <div
              className="accGroupTabGroupProfile"
              style={{ backgroundImage: `url(${group.groupProfilePic})` }}
            ></div>
            <div className="accGroupTabGroupName">{group.groupName}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="accountTabGroupsContainer">
      {groups.map((group) => (
        <GroupTabItem key={group.groupID} group={group} />
      ))}
    </div>
  );
};

const AccountLoggedIn = ({ userid }) => {
  const [user, setUser] = useState([]);
  const currentUserID = userid;

  const [showGroupsTab, setShowGroupsTab] = useState(false);
  const [showPostsTab, setShowPostsTab] = useState(true);

  // State for form inputs
  const [formData, setFormData] = useState({
    username: "",
    userFirstname: "",
    userLastname: "",
    userBio: "",
    userEmail: "",
    userPassword: "",
  });

  useEffect(() => {
    if (currentUserID) {
      fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=getFullUserDetails&userId=${currentUserID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched active user details:", data);
          if (data && !data.message) {
            // If there's no error message in the response
            setUser(data);
            // Set initial form data based on fetched user details
            setFormData({
              username: data.username,
              userFirstname: data.userFirstname,
              userLastname: data.userLastname,
              userBio: data.userBio,
              userEmail: data.userEmail,
              userPassword: "", // Leave password blank initially
            });
          } else {
            console.error(data.message || "Post not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    }
  }, [currentUserID]);

  const handleToggleGroupsTab = () => {
    setShowGroupsTab(true);
    setShowPostsTab(false);
  };

  const handleTogglePostsTab = () => {
    setShowGroupsTab(false);
    setShowPostsTab(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php?action=updateUserInfo&userId=${currentUserID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("User information updated successfully");
        // Update the user state with new data
        setUser((prevUser) => ({
          ...prevUser,
          ...formData,
          userPassword: "", // Clear password after update
        }));
      } else {
        alert("Failed to update user information: " + result.message);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("An error occurred while trying to update the user information.");
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
  };

  if (!userid) return <NotLoggedIn />;

  return (
    <>
      {/* Header */}
      <div
        className="accountHeader"
        style={{ backgroundImage: `url(${user.userBannerPic})` }}
      >
        <div className="accountHeaderOverlay">
          <div
            className="accUserProfileImg"
            style={{ backgroundImage: `url(${user.userProfilePic})` }}
          ></div>
          <div className="accUsernameGroup">
            <div className="accHeaderUsername">{user.username}</div>
            <div className="accHeaderFullname">
              {user.userFirstname} {user.userLastname}
            </div>
          </div>
        </div>
      </div>

      {/* Website content */}
      <div className="accountContent">
        <div className="accContUserPostCont">
          <div className="accContSplitterLine"></div>
          <div className="accContButtonTabsGroup">
            <button
              className={`accCBtn ${showPostsTab ? "accCBtnActive" : ""}`}
              onClick={handleTogglePostsTab}
            >
              Posts
            </button>
            <button
              className={`accCBtn ${showGroupsTab ? "accCBtnActive" : ""}`}
              onClick={handleToggleGroupsTab}
            >
              Groups
            </button>
          </div>
          <div className="accContentContainer">
            {showPostsTab && <PostTab userID={currentUserID} />}
            {showGroupsTab && <GroupsTab userID={currentUserID} />}
          </div>
        </div>
        <div className="accContUserInfoCont">
          <div className="accContUIuserCard">
            <div
              className="accContCardBanner"
              style={{ backgroundImage: `url(${user.userBannerPic})` }}
            >
              <div className="accContCardBannerOverlay">
                <Link
                  to="/SignIn"
                  style={{ textDecoration: "none" }}
                  onClick={handleLogOut}
                >
                  <button className="accContLogoutBtn">Logout</button>
                </Link>

                <div className="accContCardWrapper">
                  <div
                    className="accContCardPP"
                    style={{
                      backgroundImage: `url(${user.userProfilePic})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="accContCardBottomWrapper">
              <div className="accContCardBottomFullname">
                {user.userFirstname} {user.userLastname}
              </div>
              <div className="accContCardBottomOther">{user.userBio}</div>
              <div className="accContCardBottomOther">
                {user.userDateJoined}
              </div>
            </div>
          </div>
          <div className="accContUIupdateUserInfo">
            <form
              className="accContUIupdateUserInfoForm"
              onSubmit={handleFormSubmit}
            >
              <h3>Update your info</h3>
              <div className="signInFormGroup">
                <label>Name:</label>
                <input
                  type="text"
                  className="SignInInput"
                  name="userFirstname"
                  value={formData.userFirstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInFormGroup">
                <label>Surname:</label>
                <input
                  type="text"
                  className="SignInInput"
                  name="userLastname"
                  value={formData.userLastname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInFormGroup">
                <label>Username:</label>
                <input
                  type="text"
                  className="SignInInput"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInFormGroup">
                <label>Bio:</label>
                <input
                  type="text"
                  className="SignInInput"
                  name="userBio"
                  value={formData.userBio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInFormGroup">
                <label>Email:</label>
                <input
                  type="email"
                  className="SignInInput"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInFormGroup">
                <label>Password:</label>
                <input
                  type="password"
                  className="SignInInput"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="signInButtonGroup">
                <button className="siginSubmit" type="submit">
                  Save
                </button>
                <button className="siginOther" type="reset">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

function Account() {
  return (
    <div className="website">
      <div className="NavBarWrapper">
        <NavBar currentPage={"Account"} />
      </div>
      <div className="WebsiteContent">
        <div>
          <SideNav webPage={"Account"} />
        </div>
        <div className="WebsiteRoot">
          <AccountLoggedIn userid={sessionStorage.getItem("userId")} />
        </div>
      </div>
    </div>
  );
}

export default Account;
