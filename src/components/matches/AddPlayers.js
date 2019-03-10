import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { addPlayers } from "../../store/actions/matches";
import PlayerInput from "./PlayerInput";

class AddPlayers extends Component {
  state = {
    venue: "",
    players: 0,
    overs: 0,
    toss: "",
    batting: "",
    teamOne: "Team One",
    teamTwo: "Team Two"
  };
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    
    this.props.addPlayers(this.state);
    this.props.history.push("/");
  };
  render() {
    const { teamOne, teamTwo } = this.state;
    const { auth, match } = this.props;
    if (!auth.uid) {
      return <Redirect to="/signIn" />;
    }
    const playerInputsOne = [];
    const playerInputsTwo = [];
    for (let i = 1; i <= 10; i++) {
      playerInputsOne.push(
        <PlayerInput
          key={match.teamOne + i}
          number={i}
          handleChange={this.handleChange}
        />
      );
      playerInputsTwo.push(
        <PlayerInput
          key={match.teamTwo + i}
          number={i}
          handleChange={this.handleChange}
        />
      );
    }

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white" autoComplete="off">
          <h5 className="dark">
            Player Data
            <small className="float-right">
              {moment().format("MMMM Do, h:mm a")}
            </small>
          </h5>
          <div className="team-name mt-2">{match.teamOne}</div>
          <hr />
          {playerInputsOne}
          <div className="team-name mt-2">{match.teamTwo}</div>
          <hr />
          {playerInputsTwo}
          <div className="form-group row">
            <div className="col-sm-10">
              <button className="btn btn-primary">Add Match</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  
  return {
    auth: state.firebase.auth,
    match: state.matches.currentMatch
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addPlayers: match => dispatch(addPlayers(match))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlayers);
