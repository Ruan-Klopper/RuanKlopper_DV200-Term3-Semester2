import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./global.css";
import "./signin.css";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "http://localhost/RuanKlopper_DV200-Term3-Semester2/backend/api/v1/signin.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();

    if (response.ok) {
      console.log("Sign in successful", data);
      sessionStorage.setItem("userId", data.userId);
      navigate("/Home");
    } else {
      alert("Sign in failed: " + data.message);
    }
  };

  return (
    <div className="website">
      <div className="WebsiteContentNoNav">
        <div className="WebsiteRootSignIn">
          <div className="WebsiteRootSignInBG">
            <div className="SignInFormBody">
              <h3>Welcome back, we've missed you!</h3>
              <form onSubmit={handleSignIn}>
                <div className="signInFormGroup">
                  <label>Username:</label>
                  <input
                    type="text"
                    className="SignInInput"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="signInFormGroup">
                  <label>Password:</label>
                  <input
                    type="password"
                    className="SignInInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="signInFormGroup">
                  <label>Don't have an account?</label>
                  <Link to="/SignUp" style={{ color: "white" }}>
                    <label>Create one now</label>
                  </Link>
                </div>
                <div className="signInButtonGroup">
                  <button className="siginSubmit" type="submit">
                    Sign In
                  </button>
                  <button className="siginOther" type="reset">
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

export default SignIn;
