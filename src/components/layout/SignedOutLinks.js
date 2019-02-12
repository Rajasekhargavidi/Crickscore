import React from "react";
import { NavLink } from "react-router-dom";

const SignedOutLinks = () => {
  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <NavLink to="/signin" className="nav-link">
          Sign In
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/signup" className="nav-link">
          Sign Up
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedOutLinks;
