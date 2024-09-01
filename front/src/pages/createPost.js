import React, { useState, useRef, useEffect } from "react";
import "./global.css";
import "./createItem.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import NotLoggedIn from "../compoments/NotLoggedIn";

const GroupTargetInfoDisplay = ({ group }) => {
  if (!group) return null;

  return (
    <div className="createPostGroupTargeWrapper">
      <div className="createPostGroupTarget">
        <div
          className="createPostSelectedGroupbannerImage"
          style={{ backgroundImage: `url(${group.groupBannerPic})` }}
        >
          <div className="createPostSelectedGroupbannerImageOverlay">
            <div>
              <div className="createPostSelectedGroupName">
                {group.groupName}
              </div>
            </div>

            <div>
              <div
                className="createPostSelectedGroupProfileImg"
                style={{ backgroundImage: `url(${group.groupProfilePic})` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="createPostSelectedGroupContent">
          <div className="createPostSelectedGroupContentText">
            <h6>Description</h6>
            <p style={{ fontSize: "14px" }}>{group.groupDescription}</p>
          </div>
          <div className="createPostSelectedGroupContentText">
            <h6>Rules:</h6>
            <p style={{ fontSize: "14px", marginBottom: "1px" }}>
              {group.groupRules}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoggedInContent = ({ userID }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupDetails, setGroupDetails] = useState(null);
  const postTitleRef = useRef(null);
  const postContentRef = useRef(null);
  const [postImage, setPostImage] = useState(null);
  const [postImageURL, setPostImageURL] = useState("");

  useEffect(() => {
    if (userID) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getUserGroups&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          setGroups(data.groups || []);
        });
    }
  }, [userID]);

  useEffect(() => {
    if (selectedGroup) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/groups.php?action=getGroupDetails&groupId=${selectedGroup}`
      )
        .then((response) => response.json())
        .then((data) => {
          setGroupDetails(data);
        });
    }
  }, [selectedGroup]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPostImage(file);
      const imageURL = URL.createObjectURL(file);
      setPostImageURL(imageURL);
    }
  };

  useEffect(() => {
    return () => {
      if (postImageURL) URL.revokeObjectURL(postImageURL);
    };
  }, [postImageURL]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", userID);
    formData.append("groupId", selectedGroup);
    formData.append("title", postTitleRef.current.value);
    formData.append("content", postContentRef.current.value);
    formData.append("image", postImage);

    try {
      const response = await fetch(
        "http://localhost/QueryQuorum/react_app/backend/api/v1/posts.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Post created successfully");
      } else {
        alert("Failed to create post: " + result.message);
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("Error submitting form");
    }
  };

  const handleReset = () => {
    postTitleRef.current.value = "";
    postContentRef.current.value = "";
    setPostImage(null);
    setPostImageURL("");
  };

  if (!userID) return <NotLoggedIn />;

  return (
    <>
      <div className="createPostRoot">
        <div className="postFormRoot">
          <h1>Create a post</h1>
          <form onSubmit={handleSubmit}>
            <div className="groupFormGroup">
              <label>Choose a group:</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="groupDropdown"
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="groupFormGroup">
              <label>Post title:</label>
              <input ref={postTitleRef} type="text" className="groupInput" />
            </div>
            <div className="groupFormGroup">
              <label>Post content:</label>
              <textarea ref={postContentRef} className="groupTA" />
            </div>
            <div className="groupFormGroup">
              <label>Post Image:</label>
              <div
                className="groupImageInput"
                onClick={() =>
                  document.getElementById("postImageUpload").click()
                }
              >
                {postImageURL && (
                  <div
                    className="groupImageInputImageDisplay"
                    style={{ backgroundImage: `url(${postImageURL})` }}
                  />
                )}
                {!postImageURL && (
                  <div className="groupImageInputNoImage">
                    Click to select image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="postImageUpload"
                />
              </div>
            </div>
            <div className="groupButtonGroup">
              <button type="submit" className="groupSubmit">
                Create
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="groupOther"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="groupTargetContainer">
          <GroupTargetInfoDisplay group={groupDetails} />
        </div>
      </div>
    </>
  );
};

function CreatePost() {
  return (
    <div className="website">
      <div className="NavBarWrapper">
        <NavBar currentPage={"Create post"} />
      </div>
      <div className="WebsiteContent">
        <div>
          <SideNav webPage={""} />
        </div>
        <div className="WebsiteRoot">
          <div className="createItemRoot">
            <LoggedInContent userID={sessionStorage.getItem("userId")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
