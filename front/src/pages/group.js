import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./global.css";
import "./group.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import PostItemLg from "../compoments/postItemLG";
import NotLoggedIn from "../compoments/NotLoggedIn";

const MemberItem = ({ userID }) => {
  const UserID = userID;
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (UserID) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=getFullUserDetails&userId=${UserID}`
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

const GroupPostItem = ({ post }) => {
  const [userProfilePic, setUserProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [postRepliesLength, setPostRepliesLength] = useState("");
  const postViewsCount = post.postViews ? post.postViews : 0;
  const postLikesCount = post.postLikes ? post.postLikes : 0;
  const postTargetURL = "/post?" + post.postID;

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
              <div className="postReplyAmount">XX Relies</div>
            </div>
            <div className="postLeftOther">
              {postViewsCount} views, {postLikesCount} likes
            </div>
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
};

const LoggedInContent = ({ userid }) => {
  // Get the selected post to view from the url post?(postID
  const location = useLocation();
  const query = location.search;
  const groupID = query.substring(1);

  const currentUserID = userid;

  const [group, setGroup] = useState([]);
  const [posts, setPosts] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [userJoined, setUserJoined] = useState(false);

  // Get group details
  useEffect(() => {
    if (groupID) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroupDetails&groupId=${groupID}`
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

  // Get all posts by group ID
  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php?action=getPostsByGroupID&groupID=${groupID}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched group related posts:", data); // Logging the fetched data
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          console.log("No posts found for this group.");
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [groupID]); // Added groupID as a dependency

  // Get all group members

  // Check if the current user is a member of the group
  useEffect(() => {
    if (currentUserID) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/groupMembers.php?action=checkUserInGroup&groupID=${groupID}&userID=${currentUserID}`
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

  const handleJoinGroup = async (e) => {
    e.preventDefault();

    if (!userJoined && currentUserID) {
      try {
        const response = await fetch(
          `http://localhost/QueryQuorum/react_app/backend/api/v1/groupMembers.php?action=addGroupMember&groupID=${groupID}&userID=${currentUserID}&role=member`,
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
        `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroupMembersFromID&groupId=${groupID}`
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
    fetchGroupMembers(); // Call this function to fetch the group members when the component mounts or when groupID changes
  }, [groupID]);

  return (
    <>
      <div className="groupPageRoot">
        <div className="groupPageRoot">
          <div
            className="groupPageBanner"
            style={{ backgroundImage: `url(${group.groupBannerPic})` }}
          >
            <div className="groupPageBannerOverlay">
              <div className="groupPageBannerInfo">
                <div className="groupPageBannerNameGroup">
                  <div
                    className="groupPageBannerGroupPic"
                    style={{ backgroundImage: `url(${group.groupProfilePic})` }}
                  ></div>
                  <div className="groupPageBannerName">{group.groupName}</div>
                </div>
                <div className="groupPageBannerStats">
                  <div className="groupPageBannerStatGroup">
                    <div className="groupPageBannerStatTop">290</div>
                    <div className="groupPageBannerStatBottom">Posts</div>
                  </div>
                  <div className="groupPageBannerStatGroup">
                    <div className="groupPageBannerStatTop">32</div>
                    <div className="groupPageBannerStatBottom">Members</div>
                  </div>
                  <div className="groupPageBannerStatGroup">
                    <div className="groupPageBannerStatTop">2k</div>
                    <div className="groupPageBannerStatBottom">views</div>
                  </div>
                </div>
                <div>
                  <button
                    className="groupPageBannerButton"
                    onClick={handleJoinGroup}
                  >
                    {userJoined ? "Joined" : "Join"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="groupPageContent">
            <div className="groupPageContentLeft">
              <h1>Posts</h1>
              {posts.map((post) => (
                <div style={{ marginBottom: "20px" }}>
                  <GroupPostItem key={post.postID} post={post} />
                </div>
              ))}
              {/* Recent posts goes here */}
            </div>
            <div className="groupPageContentRight">
              <div className="groupDetailsBody">
                <div
                  className="groupDetailsImage"
                  style={{ backgroundImage: `url(${group.groupBannerPic})` }}
                >
                  <div className="groupDetailsImageOverlay">
                    <div className="groupDetailsName">{group.groupName}</div>
                  </div>
                </div>
                <div className="groupDetailsContent">
                  <div className="groupDetailsContentText">
                    Group description: {group.groupDescription}
                  </div>
                  <div className="groupDetailsContentText">
                    Group rules: {group.groupRules}
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
          </div>
        </div>
      </div>
    </>
  );
};

function Group() {
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
          <LoggedInContent userid={sessionStorage.getItem("userId")} />
        </div>
      </div>
    </div>
  );
}

export default Group;
