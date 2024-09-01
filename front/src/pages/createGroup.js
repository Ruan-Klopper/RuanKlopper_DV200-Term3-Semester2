import React, { useState, useRef, useEffect } from "react";
import "./global.css";
import "./createItem.css";
import NavBar from "../compoments/navbar"; // corrected typo
import SideNav from "../compoments/sideNav"; // corrected typo
import NotLoggedIn from "../compoments/NotLoggedIn"; // corrected typo

function LoggedInContent({ userID }) {
  const [groupProfileImage, setGroupProfileImage] = useState(null);
  const [groupProfileImageURL, setGroupProfileImageURL] = useState(null);
  const [groupBannerImage, setGroupBannerImage] = useState(null);
  const [groupBannerImageURL, setGroupBannerImageURL] = useState(null);

  const titleInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const rulesRef = useRef(null);

  const handleImageChange = (event, setImage, setImageURL) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Sets the file object
      const imageURL = URL.createObjectURL(file);
      setImageURL(imageURL); // Sets the URL for display
    }
  };

  useEffect(() => {
    return () => {
      if (groupProfileImageURL) URL.revokeObjectURL(groupProfileImageURL);
      if (groupBannerImageURL) URL.revokeObjectURL(groupBannerImageURL);
    };
  }, [groupProfileImageURL, groupBannerImageURL]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", userID);
    formData.append("groupName", titleInputRef.current.value);
    formData.append("groupDescription", descriptionRef.current.value);
    formData.append("groupRules", rulesRef.current.value);
    if (groupProfileImage) {
      formData.append("groupProfilePic", groupProfileImage);
    }
    if (groupBannerImage) {
      formData.append("groupBannerPic", groupBannerImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: `,
        value instanceof Blob ? `${value.name} (type: ${value.type})` : value
      );
    }

    try {
      const response = await fetch(
        "http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/groups.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      console.log(result); // Log the response from the server
      if (response.ok) {
        alert("Group created successfully");
      } else {
        alert("Failed to create group: " + result.message);
      }
    } catch (error) {
      console.error("Group creation error:", error);
      alert("Error submitting form");
    }
  };

  const handleReset = () => {
    titleInputRef.current.value = "";
    descriptionRef.current.value = "";
    rulesRef.current.value = "";
    setGroupProfileImage(null);
    setGroupProfileImageURL(null);
    setGroupBannerImage(null);
    setGroupBannerImageURL(null);
  };

  return (
    <>
      <div className="groupRoot">
        <div className="groupFormRoot">
          <h1>Create a group</h1>
          <form onSubmit={handleSubmit}>
            <div className="groupFormGroup">
              <label>Group Title:</label>
              <input ref={titleInputRef} type="text" className="groupInput" />
            </div>
            <div className="groupFormGroup">
              <label>Group Description:</label>
              <textarea ref={descriptionRef} className="groupTA" />
            </div>
            <div className="groupFormGroup">
              <label>Group Rules:</label>
              <textarea ref={rulesRef} className="groupTA" />
            </div>

            <div className="groupFormGroup">
              <div className="groupFormImageInputGroup">
                {/* Group profile and banner image inputs, updated with structured labeling and handling */}
                {/* Profile Image Input */}
                <div className="groupFormImg">
                  <label>Group Profile Picture:</label>
                  <div
                    className="groupImageInput"
                    onClick={() =>
                      document.getElementById("profileImageUpload").click()
                    }
                  >
                    {groupProfileImageURL ? (
                      <div
                        className="groupImageInputImageDisplay"
                        style={{
                          backgroundImage: `url(${groupProfileImageURL})`,
                        }}
                      ></div>
                    ) : (
                      <div className="groupImageInputNoImage">
                        Click to select image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setGroupProfileImage,
                          setGroupProfileImageURL
                        )
                      }
                      style={{ display: "none" }}
                      id="profileImageUpload"
                    />
                  </div>
                </div>
                {/* Banner Image Input */}
                <div className="groupFormImg">
                  <label>Group Banner Picture:</label>
                  <div
                    className="groupImageInput"
                    onClick={() =>
                      document.getElementById("bannerImageUpload").click()
                    }
                  >
                    {groupBannerImageURL ? (
                      <div
                        className="groupImageInputImageDisplay"
                        style={{
                          backgroundImage: `url(${groupBannerImageURL})`,
                        }}
                      ></div>
                    ) : (
                      <div className="groupImageInputNoImage">
                        Click to select image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setGroupBannerImage,
                          setGroupBannerImageURL
                        )
                      }
                      style={{ display: "none" }}
                      id="bannerImageUpload"
                    />
                  </div>
                </div>
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
      </div>
    </>
  );
}

function CreateGroup() {
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
        <NavBar currentPage={"Create group"} />
      </div>
      <div className="WebsiteContent">
        <div>
          <SideNav webPage={"Create group"} />
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

export default CreateGroup;
