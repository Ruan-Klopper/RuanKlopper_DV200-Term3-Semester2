import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Pages
import Home from "./pages/home";
import Group from "./pages/group";
import Post from "./pages/post";
import CreatePost from "./pages/createPost";
import CreateGroup from "./pages/createGroup";
import Account from "./pages/account";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Group" element={<Group />} />
          <Route path="/Post" element={<Post />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/CreateGroup" element={<CreateGroup />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
