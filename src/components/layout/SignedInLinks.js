import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/auth";

const SignedInLinks = ({ auth, signOut, user }) => {
  return (
    <ul className="right">
      <li>
        <NavLink to="/create">New Project</NavLink>
      </li>
      <li>
        <a onClick={signOut}>Logout</a>
      </li>
      <li>
        <NavLink to="/" className="btn btn-floating pink lighten-1">
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
