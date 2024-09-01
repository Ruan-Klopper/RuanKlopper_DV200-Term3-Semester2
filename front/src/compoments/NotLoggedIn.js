import "../pages/global.css";
import { Link, useLocation } from "react-router-dom";

function NotLoggedIn() {
  return (
    <div className="NLIbody">
      <div className="NLIwrapper">
        <h2>Please Sign in or Sign up</h2>
        <h5>
          In order to continue, you need to sign in or create an account by
          signing up
        </h5>
        <div>
          <Link to="/SignIn" style={{ textDecoration: "none" }}>
            <button className="NLIbtn">Sign in</button>
          </Link>
          <Link to="/SignUp" style={{ textDecoration: "none" }}>
            <button className="NLIbtn">Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotLoggedIn;
