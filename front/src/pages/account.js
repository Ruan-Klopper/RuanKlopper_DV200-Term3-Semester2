import "./global.css";
import "./account.css";
import NavBar from "../compoments/navbar";
import SideNav from "../compoments/sideNav";
import NotLoggedIn from "../compoments/NotLoggedIn";
import { useState, useEffect } from "react";

const AccountLoggedIn = ({ userid }) => {
  const [user, setUser] = useState([]);
  const currentUserID = userid;

  useEffect(() => {
    if (currentUserID) {
      fetch(
        `http://localhost/QueryQuorum/react_app/backend/api/v1/users.php?action=getFullUserDetails&userId=${currentUserID}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched active user details:", data);
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
  }, [currentUserID]);

  return (
    <>
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
      <div className="accountContent">
        <div className="accContUserPostCont">
          <div className="accContSplitterLine"></div>
          <div className="accContButtonTabsGroup">
            <button className="accCBtn accCBtnActive">Posts</button>
            <button className="accCBtn">Saved</button>
            <button className="accCBtn">Groups</button>
          </div>
          <div className="accContentContainer"></div>
        </div>
        <div className="accContUserInfoCont">
          <div className="accContUIuserCard">
            <div
              className="accContCardBanner"
              style={{ backgroundImage: `url(${user.userBannerPic})` }}
            >
              <div className="accContCardBannerOverlay">
                <div>
                  <button className="accContLogoutBtn">Logout</button>
                </div>

                <div className="accContCardWrapper">
                  <div className="accContCardDataWrapper">
                    <div className="accContCardData">
                      <div className="accContCardDataTop">32</div>
                      <div className="accContCardDataBottom">Groups</div>
                    </div>
                    <div className="accContCardData">
                      <div className="accContCardDataTop">290</div>
                      <div className="accContCardDataBottom">Posts</div>
                    </div>
                  </div>
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
              <div className="accContCardBottomOther">Joined in March 2007</div>
            </div>
          </div>
          <div className="accContUIupdateUserInfo">
            <form action="" className="accContUIupdateUserInfoForm">
              <h3>Update your info</h3>
              {/* If an item is left blank it should not update it, but should be processed in the backend */}
              <div className="signInFormGroup">
                <label>Name:</label>
                <input type="text" className="SignInInput" />
              </div>
              <div className="signInFormGroup">
                <label>Surname:</label>
                <input type="text" className="SignInInput" />
              </div>
              <div className="signInFormGroup">
                <label>Username:</label>
                <input type="text" className="SignInInput" />
              </div>
              <div className="signInFormGroup">
                <label>Bio:</label>
                <input type="text" className="SignInInput" />
              </div>
              <div className="signInFormGroup">
                <label>Email:</label>
                <input type="email" className="SignInInput" />
              </div>
              <div className="signInFormGroup">
                <label>Password:</label>
                <input type="password" className="SignInInput" />
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
