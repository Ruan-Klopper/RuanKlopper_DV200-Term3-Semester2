import React, { useState, useRef, useEffect } from "react";
import "./global.css";
import "./createItem.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import NotLoggedIn from "../compoments/NotLoggedIn";

const LoggedInContent = ({ userID }) => {
  const [postImage, setPostImage] = useState(null);
  const [postImageURL, setPostImageURL] = useState("");

  const handlePostImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setPostImageURL(file.name);
    }
  };

  const handleReset = () => {
    setPostImage(null);
    setPostImageURL("");
  };
  return (
    <>
      <div className="createPostRoot">
        <div className="postFormRoot">
          <h1>Create a post</h1>

          <form action="">
            <div className="groupFormGroup">
              <label htmlFor="groupSelect">Choose a group:</label>
              <div className="groupDropdownWrapper">
                <select id="groupSelect" className="groupDropdown">
                  <option value="">Select a group</option> // Placeholder option
                  <option value="group1">Group 1</option>
                  <option value="group2">Group 2</option>
                  <option value="group3">Group 3</option>
                  // Add more options as needed
                </select>
              </div>
            </div>

            <div className="groupFormGroup">
              <label>Post title:</label>
              <input type="text" className="groupInput" />
            </div>
            <div className="groupFormGroup">
              <label>Post content</label>
              <textarea type="text" className="groupTA" />
            </div>

            <div className="groupFormGroup">
              <div className="groupFormImageInputGroup">
                <div className="groupFormImg">
                  <div style={{ width: "150px" }}>
                    <label className="groupFormImgLabel">Post Image:</label>
                    <div className="groupImageInput">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePostImageChange}
                        style={{ display: "none" }}
                        id="profileImageUpload"
                      />
                      <div
                        className="groupImageInputImageDisplay"
                        onClick={() =>
                          document.getElementById("profileImageUpload").click()
                        }
                        style={{
                          backgroundImage: postImage
                            ? `url(${postImage})`
                            : "none",
                        }}
                      >
                        {!postImage && (
                          <div className="groupImageInputNoImage"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="groupButtonGroup">
              <button className="groupSubmit" type="submit">
                Create
              </button>
              <button
                className="groupOther"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="createPostGroupTargeWrapper">
          <div className="createPostGroupTarget">
            <div
              className="createPostSelectedGroupbannerImage"
              style={{ backgroundImage: `url(../assets/test/bg1.jpeg)` }}
            >
              <div className="createPostSelectedGroupbannerImageOverlay">
                <div className="createPostSelectedGroupName">qq_arduino</div>
              </div>
            </div>
            <div className="createPostSelectedGroupContent">
              <div className="createPostSelectedGroupContentText">
                Group description: asfasfsfdsadadasdad
              </div>
              <div className="createPostSelectedGroupContentText">
                Group rules: asfasfsfdsadadasdad
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function CreatePost() {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      setUserID(userId);
    }
  }, []);
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
            {userID ? <LoggedInContent userID={userID} /> : <NotLoggedIn />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
