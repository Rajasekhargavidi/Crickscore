import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signIn } from "../../store/actions/auth";

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.signIn(this.state);
  };
  render() {
    const { auth } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white" autoComplete="off">
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className=""
              id="email"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className=""
              id="password"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <button className="btn pink light-1 z-depth-0">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: credentials => dispatch(signIn(credentials))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin);
