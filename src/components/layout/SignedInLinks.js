import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/auth";
import { createTeam } from '../../store/actions/auth';

const SignedInLinks = ({ auth, signOut, createTeam, user }) => {
  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <NavLink to="/newMatch" className="nav-link">
          New Match
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/matches" className="nav-link">
          Matches
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/matches" className="nav-link">
          Players
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/matches" className="nav-link">
          Teams
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/createTeam" className="nav-link">
          Tournaments
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink to="/matches" className="nav-link">
          Users
        </NavLink>
      </li>
      <li className="nav-item active">
        <a onClick={signOut} className="nav-link">
          Logout
        </a>
      </li>
      
      <li className="nav-item active">
        <NavLink to="/" className="btn btn-danger">
          {user && user.initials}
        </NavLink>
      </li>
    </ul>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};
const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    user: state.firebase.profile
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignedInLinks);
