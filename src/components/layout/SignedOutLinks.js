import React from "react";
import { NavLink } from "react-router-dom";

const SignedOutLinks = () => {
  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <NavLink to="/matches" className="nav-link">
          All Matches
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/signin" className="nav-link">
          Login
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/signup" className="nav-link">
          Register
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedOutLinks;
