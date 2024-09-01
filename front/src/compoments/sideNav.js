import React, { useState, useEffect } from "react";
import "./sideNav.css";
import { Link, useLocation } from "react-router-dom";

function SideNav({ webPage }) {
  const [allGroup, setAllGroups] = useState([]);
  const [posts, setPosts] = useState([]);

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

  const SNrecentPostItem = ({ postID, postImageURL, postTitle }) => {
    const linkTo = "/post?" + postID;

    const containerClass = postImageURL
      ? "SNrecentPostItemBodWithImage"
      : "SNrecentPostItemBodyWithOutImage";

    const TextContainerClass = postImageURL
      ? "SNrecentPostItemTextContainer"
      : "SNrecentPostItemTextContainerWithOutImage";

    return (
      <Link to={linkTo} style={{ textDecoration: "none" }}>
        <div className={containerClass}>
          {postImageURL && (
            <div
              className="SNrecentPostItemImage"
              style={{ backgroundImage: `url(${postImageURL})` }}
            ></div>
          )}

          <div className={TextContainerClass}>
            <div className="SNrecentPostItemText">{postTitle}</div>
          </div>
        </div>
      </Link>
    );
  };

  const SNgroupItem = ({ groupID, groupImageUrl, groupTitle }) => {
    const linkTo = "/group?" + groupID;

    return (
      <Link to={linkTo} style={{ textDecoration: "none" }}>
        <div className="SNgroupItemBody">
          <div
            className="SNgroupItemImage"
            style={{ backgroundImage: `url(${groupImageUrl})` }}
          ></div>
          <div className="SNgroupItemText">{groupTitle}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="SideNavBody">
      <div className="SNsplitterline"></div>
      <div className="SNnavs">
        <Link
          to="/Home"
          className={`SNnav ${webPage === "Home" ? "SNnavActive" : ""}`}
          style={{ textDecoration: "none" }}
        >
          <div className="SNnavIconH"></div>
          Home
        </Link>
        <Link
          to="/Account"
          className={`SNnav ${webPage === "Account" ? "SNnavActive" : ""}`}
          style={{ textDecoration: "none" }}
        >
          <div className="SNnavIconA"></div>
          Account
        </Link>
      </div>
      <div className="SNsplitterline"></div>
      <div className="SNrecentposts">
        <h5 style={{ paddingTop: "15px", textAlign: "center" }}>
          Recent posts
        </h5>
        <div className="SNrecentpostContainer">
          {posts.map((post) => (
            <SNrecentPostItem
              key={post.postID}
              postID={post.postID}
              postTitle={post.postTitle}
              postImageURL={post.postImage}
            />
          ))}
        </div>
      </div>
      <div className="SNsplitterline"></div>
      <Link to="/CreatePost" style={{ textDecoration: "none" }}>
        <div className="SNbuttonCreatePost">
          <div className="SNbuttonPlusIcon"></div>
          <div className="SNbuttonText">Create a post</div>
        </div>
      </Link>
      <Link to="/CreateGroup" style={{ textDecoration: "none" }}>
        <div className="SNbuttonCreateGroup">
          <div className="SNbuttonPlusIcon"></div>
          <div className="SNbuttonText">Create a group</div>
        </div>
      </Link>
      <div className="SNsplitterline"></div>
      <div className="SNgroups">
        <h5>Groups</h5>
        <div className="SNgroupsContainer">
          {allGroup.map((group) => (
            <SNgroupItem
              key={group.groupID}
              groupID={group.groupID}
              groupTitle={group.groupName}
              groupImageUrl={group.groupProfilePic}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideNav;
