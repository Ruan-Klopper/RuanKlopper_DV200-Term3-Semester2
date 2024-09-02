import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const DesktopNavLoggedIn = ({ currentPage, username, userProfilePicURL }) => {
  const handleLogOut = () => {
    sessionStorage.clear();
  };
  return (
    <div className="DNavbody">
      <Link to="/Home" style={{ textDecoration: "none" }}>
        <div className="DLogoLeft">
          <div className="DICON"></div>
          <div className="DNAME">QueryQuorum</div>
        </div>
      </Link>
      <div className="DPage">{currentPage}</div>
      <div className="DAccountInfo">
        <div>
          <Link
            to="/Account"
            className="DACCITEM"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Hi {username}
          </Link>
          <Link
            to="/SignIn"
            className="DACCITEM"
            style={{ textDecoration: "none" }}
            onClick={handleLogOut}
          >
            Sign Out
          </Link>
        </div>
        <div
          className="NavAccountPic"
          style={{ backgroundImage: `url(${userProfilePicURL})` }}
        ></div>
      </div>
    </div>
  );
};

const DesktopNavNotLoggedIn = ({ currentPage }) => {
  return (
    <div className="DNavbody">
      <Link to="/Home" style={{ textDecoration: "none" }}>
        <div className="DLogoLeft">
          <div className="DICON"></div>
          <div className="DNAME">QueryQuorum</div>
        </div>
      </Link>
      <div className="DPage">{currentPage}</div>
      <div className="DAccountInfo" style={{ paddingRight: "50px" }}>
        <Link
          to="/SignIn"
          className="DACCITEM"
          style={{ textDecoration: "none" }}
        >
          Sign In
        </Link>
        <Link
          to="/SignUp"
          className="DACCITEM"
          style={{ textDecoration: "none" }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

function NavBar({ currentPage }) {
  const [userID, setUserID] = useState(sessionStorage.getItem("userId"));
  const [username, setUsername] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");

  useEffect(() => {
    if (userID) {
      // Fetch user info when user ID is available
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=GETusernameBYid&userId=${userID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setUsername(data.username);
            setUserProfilePic(data.userProfilePic); // Assuming userProfilePic is returned
          }
        });
    }
  }, [userID]);

  return (
    <div className="NavGroup">
      {userID ? (
        <DesktopNavLoggedIn
          currentPage={currentPage}
          username={username}
          userProfilePicURL={userProfilePic}
        />
      ) : (
        <DesktopNavNotLoggedIn currentPage={currentPage} />
      )}
    </div>
  );
}

export default NavBar;
