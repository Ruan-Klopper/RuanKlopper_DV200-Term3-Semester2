import React, { useState, useEffect } from "react";
import "./global.css";
import "./home.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import PostItemLg from "../compoments/postItemLG";
import { Link, useNavigate } from "react-router-dom";

const LoggedInContent = ({ username }) => {
  const [showHotGroups, setShowHotGroups] = useState(window.innerWidth >= 1300);
  const [groupsCount, setGroupsCount] = useState("");
  const [postsCount, setPostsCount] = useState("");
  const [usersCount, setUsersCount] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php?action=getAllPosts`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched posts:", data); // Logging the fetched data
        if (data && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=getUserCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalUsers !== undefined) {
          setUsersCount(data.totalUsers); // Accessing the correct field
        } else {
          setUsersCount(0); // Default to 0 if no data or field found
        }
      })
      .catch((error) => {
        console.error("Error fetching user count:", error);
        setUsersCount("0"); // Default to 0 in case of error
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroupCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalGroups !== undefined) {
          setGroupsCount(data.totalGroups);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setGroupsCount("0");
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php?action=getPostCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalPosts !== undefined) {
          setPostsCount(data.totalPosts);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPostsCount("0");
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowHotGroups(window.innerWidth >= 1300);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div>
        <SideNav webPage={"Home"} />
      </div>
      <div className="WebsiteRoot">
        <div className="homeContainer">
          <div className="homeHeader">
            <div className="homeHeaderHeader">
              <div className="homeHeaderContentWrapper">
                <h1>Hi {username} Start the conversation</h1>
                <h4>
                  Ask questions and discuss issues and get solutions! STAY
                  CURIOUS
                </h4>
                <Link to="/CreatePost" style={{ textDecoration: "none" }}>
                  <button className="redButton">Create post</button>
                </Link>

                <div className="homeHeaderStatsContainer">
                  <div className="homeStatItem">
                    <div className="homeStatHeading">{groupsCount}</div>
                    <div className="homeStatsubHeading">Groups</div>
                  </div>
                  <div className="homeStatItem">
                    <div className="homeStatHeading">{postsCount}</div>
                    <div className="homeStatsubHeading">Posts</div>
                  </div>
                  <div className="homeStatItem">
                    <div className="homeStatHeading">{usersCount}</div>
                    <div className="homeStatsubHeading">Members</div>
                  </div>
                </div>
              </div>
              <div className="homeHeaderImage"></div>
            </div>
          </div>
          <div className="homeHotDiscussionsCont">
            <div className="homeHotDiscussions">
              <h3>🔥 Hot discussions 🔥</h3>
              <div className="homeHotDiscussionsPostCont">
                <div className="homePostWrapper"></div>
              </div>
            </div>
          </div>
          <div className="homeSplitterLine"></div>
          <div className="homePostContWrapper">
            <div className="homePostContainer">
              <div className="homeRecentPosts">
                {/* Load all posts here, all posts from the posts table */}
                {/* Use post item with wrapper to create multiple items */}
                {posts.map((post) => (
                  <div className="homePostBottomWrapper">
                    <PostItemLg key={post.postID} post={post} />
                  </div>
                ))}
              </div>
              {/* Display homeHotgroups when display width is wider than 849px */}
              <div className="homeHotGroupsContainerH">
                {showHotGroups && <HomeHotGroups />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LoggedOutContent = () => {
  const [showHotGroups, setShowHotGroups] = useState(window.innerWidth >= 1300);
  const [groupsCount, setGroupsCount] = useState("");
  const [postsCount, setPostsCount] = useState("");
  const [usersCount, setUsersCount] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php?action=getAllPosts`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Logging the fetched data
        if (data && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=getUserCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalUsers !== undefined) {
          setUsersCount(data.totalUsers); // Accessing the correct field
        } else {
          setUsersCount(0); // Default to 0 if no data or field found
        }
      })
      .catch((error) => {
        console.error("Error fetching user count:", error);
        setUsersCount("0"); // Default to 0 in case of error
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroupCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalGroups !== undefined) {
          setGroupsCount(data.totalGroups);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setGroupsCount("0");
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php?action=getPostCount`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.totalPosts !== undefined) {
          setPostsCount(data.totalPosts);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPostsCount("0");
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowHotGroups(window.innerWidth >= 1300);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div>
        <SideNav webPage={"Home"} />
      </div>
      <div className="WebsiteRoot">
        <div className="homeContainer">
          <div className="homeHeader">
            <div className="homeHeaderHeader">
              <div className="homeHeaderContentWrapper">
                <h1>Welcome to QueryQourum</h1>
                <h4>
                  Ask questions and discuss issues and get solutions! STAY
                  CURIOUS
                </h4>
                <Link
                  to="/SignIn"
                  style={{ textDecoration: "none", marginRight: "10px" }}
                >
                  <button className="redButton">Sign In</button>
                </Link>
                <Link to="/SignUp" style={{ textDecoration: "none" }}>
                  <button className="redButton">Sign Up</button>
                </Link>

                <div className="homeHeaderStatsContainer">
                  <div className="homeStatItem">
                    <div className="homeStatHeading">689k</div>
                    <div className="homeStatsubHeading">Groups</div>
                  </div>
                  <div className="homeStatItem">
                    <div className="homeStatHeading">134k</div>
                    <div className="homeStatsubHeading">Posts</div>
                  </div>
                  <div className="homeStatItem">
                    <div className="homeStatHeading">12k</div>
                    <div className="homeStatsubHeading">Members</div>
                  </div>
                </div>
              </div>
              <div className="homeHeaderImage"></div>
            </div>
          </div>
          <div className="homeHotDiscussionsCont">
            <div className="homeHotDiscussions">
              <h3>🔥 Hot discussions 🔥</h3>
              <div className="homeHotDiscussionsPostCont">
                <div className="homePostWrapper"></div>
              </div>
            </div>
          </div>
          <div className="homeSplitterLine"></div>
          <div className="homePostContWrapper">
            <div className="homePostContainer">
              <div className="homeRecentPosts">
                {posts.map((post) => (
                  <div className="homePostBottomWrapper">
                    <PostItemLg key={post.postID} post={post} />
                  </div>
                ))}
              </div>
              {/* Display homeHotgroups when display width is wider than 849px */}
              <div className="homeHotGroupsContainerH">
                {showHotGroups && <HomeHotGroups />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HomeHotGroupItem = ({ groupID, groupTitle, groupPhoto }) => {
  const linkTo = "/group?" + groupID;
  return (
    <Link to={linkTo} style={{ textDecoration: "none" }}>
      <div className="homeGroupItemBody">
        <div
          className="homeGroupItemPhoto"
          style={{ backgroundImage: `url(${groupPhoto})` }}
        ></div>
        <div className="homeGroupItemTitle">{groupTitle}</div>
      </div>
    </Link>
  );
};

const HomeHotGroups = () => {
  const [allGroup, setAllGroups] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getAllGroups`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched groups:", data); // Logging the fetched data
        if (data && data.length > 0) {
          setAllGroups(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="homeHotGroups">
      <h1>Hot groups</h1>
      <div className="homeHotGroupsContainer">
        {allGroup.map((group) => (
          <HomeHotGroupItem
            key={group.groupID}
            groupID={group.groupID}
            groupTitle={group.groupName}
            groupPhoto={group.groupProfilePic}
          />
        ))}
      </div>
    </div>
  );
};

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      fetchUsername(userId);
    }
  }, []);

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=GETusernameBYid&userId=${userId}`
      );
      const data = await response.json();
      if (response.ok) {
        setUsername(data.username);
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username", error);
    }
  };

  return (
    <div className="website">
      <div className="NavBarWrapper">
        <NavBar currentPage={"Home"} />
      </div>
      <div className="WebsiteContent">
        {username ? (
          <LoggedInContent username={username} />
        ) : (
          <LoggedOutContent />
        )}
      </div>
    </div>
  );
}

export default Home;
