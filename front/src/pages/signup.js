import React, { useState, useEffect } from "react";
import "./global.css";
import "./signin.css";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageURL, setBannerImageURL] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setImage, setImageURL) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Sets the file object
      const imageURL = URL.createObjectURL(file);
      setImageURL(imageURL); // Sets the URL for display
    }
  };

  // Cleanup the created URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (profileImageURL) URL.revokeObjectURL(profileImageURL);
      if (bannerImageURL) URL.revokeObjectURL(bannerImageURL);
    };
  }, [profileImageURL, bannerImageURL]);

  const handleReset = () => {
    setFormData({
      name: "",
      surname: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    });
    setProfileImage(null);
    setProfileImageURL(null);
    setBannerImage(null);
    setBannerImageURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("userFirstname", formData.name);
    data.append("userLastname", formData.surname);
    data.append("userBio", formData.bio);
    data.append("userEmail", formData.email);
    data.append("userPassword", formData.password);
    if (profileImage) {
      data.append("userProfilePic", profileImage);
    }
    if (bannerImage) {
      data.append("userBannerPic", bannerImage);
    }

    // Log each key-value pair in FormData
    for (let [key, value] of data.entries()) {
      console.log(
        `${key}: `,
        value instanceof Blob ? `${value.name} (type: ${value.type})` : value
      );
    }

    try {
      const response = await fetch(
        "http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/users.php",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      console.log(result); // Log the response from the server
      if (response.ok) {
        alert("User registered successfully");
        navigate("/SignIn");
      } else {
        alert("Failed to register user: " + result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="website">
      <div className="WebsiteContentNoNav">
        <div className="WebsiteRootSignIn">
          <div className="WebsiteRootSignInBG">
            <div className="SignUoFormBody">
              <h3>Ready to start the journey?</h3>
              <form onSubmit={handleSubmit}>
                <div className="signInFormGroup">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="SignInInput"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="signInFormGroup">
                  <label>Surname:</label>
                  <input
                    type="text"
                    className="SignInInput"
                    name="surname"
                    value={formData.surname}
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
                  <textarea
                    className="SignInTA"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="signInFormGroup">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="SignInInput"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="signInFormGroup">
                  <label>Password:</label>
                  <input
                    type="password"
                    className="SignInInput"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Profile Image Input */}
                <div className="signInImageGroup">
                  <div className="SignInImgGpLeft">
                    <label>Profile Picture:</label>
                    <div
                      className="SignInAddImgBox"
                      onClick={() =>
                        document.getElementById("profileImageUpload").click()
                      }
                    >
                      {profileImageURL ? (
                        <div
                          className="SignInAddImgBoxImg"
                          style={{ backgroundImage: `url(${profileImageURL})` }}
                        ></div>
                      ) : (
                        <div className="SignInAddImgBoxNoImg">
                          Click to select image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setProfileImage,
                            setProfileImageURL
                          )
                        }
                        style={{ display: "none" }}
                        id="profileImageUpload"
                      />
                    </div>
                  </div>
                  <div className="SignInImgGpRight">
                    <label>Banner Picture:</label>
                    <div
                      className="SignInAddImgBox"
                      onClick={() =>
                        document.getElementById("bannerImageUpload").click()
                      }
                    >
                      {bannerImageURL ? (
                        <div
                          className="SignInAddImgBoxImg"
                          style={{ backgroundImage: `url(${bannerImageURL})` }}
                        ></div>
                      ) : (
                        <div className="SignInAddImgBoxNoImg">
                          Click to select image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setBannerImage,
                            setBannerImageURL
                          )
                        }
                        style={{ display: "none" }}
                        id="bannerImageUpload"
                      />
                    </div>
                  </div>
                </div>

                <div className="signInFormGroup">
                  <label>Already have an account?</label>
                  <Link to="/SignIn" style={{ color: "white" }}>
                    <label>Sign in now</label>
                  </Link>
                </div>
                <div className="signInButtonGroup">
                  <button className="siginSubmit" type="submit">
                    Sign Up
                  </button>
                  <button
                    className="siginOther"
                    type="reset"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <Link to="/Home" style={{ textDecoration: "none" }}>
                    <button className="siginOther" type="button">
                      Cancel
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
