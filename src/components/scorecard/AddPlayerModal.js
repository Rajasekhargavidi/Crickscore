import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import { has, startCase, toLower, find } from "lodash";

class BatsmanModal extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    striker: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      battingOrder: 1
    },
    nonStriker: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      battingOrder: 2
    },
    bowler: {
      id: "",
      name: "",
      teamName: "",
      teamId: "",
      onStrike: true,
      bowlingOrder: 1
    }
  };

  render() {
    const {
      openModal,
      submitInitialPlayers,
      battingSquad,
      bowlingSquad,
      battingTeam,
      battingTeamId,
      bowlingTeam,
      bowlingTeamId,
      currentMatch
    } = this.props;
    const { striker, nonStriker, bowler } = this.state;
    return (
      <Modal isOpen={openModal} className={this.props.className}>
        <ModalHeader>
          <div className="score-label">
            {currentMatch.teamOne} vs {currentMatch.teamTwo}
          </div>
        </ModalHeader>
        <form
          onSubmit={e => {
            submitInitialPlayers(e, striker, nonStriker, bowler);
          }}
          autoComplete="off"
          className="m-0 p-0"
        >
          <ModalBody>
            <h5>{battingTeam}</h5>
            <div className="form-group row">
              <label htmlFor="striker" className="col-sm-2 col-form-label">
                Striker
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    if (selected.length) {
                      let strikerId;
                      if (has(selected[0], "customOption")) {
                        strikerId = "";
                      } else {
                        strikerId = selected[0].id;
                      }
                      this.setState({
                        striker: {
                          id: strikerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: battingTeam,
                          teamId: battingTeamId,
                          onStrike: true,
                          battingOrder: 1,
                          balls: 0,
                          runs: 0,
                          dots: 0,
                          fours: 0,
                          sixes: 0,
                          sr: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={battingSquad !== undefined ? battingSquad : []}
                  filterBy={["name"]}
                  placeholder="Type player name..."
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="nonStriker" className="col-sm-2 col-form-label">
                Non Striker
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    if (selected.length) {
                      let nonStrikerId;
                      if (has(selected[0], "customOption")) {
                        nonStrikerId = "";
                      } else {
                        nonStrikerId = selected[0].id;
                      }
                      this.setState({
                        nonStriker: {
                          id: nonStrikerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: battingTeam,
                          teamId: battingTeamId,
                          onStrike: false,
                          battingOrder: 2,
                          balls: 0,
                          runs: 0,
                          dots: 0,
                          fours: 0,
                          sixes: 0,
                          sr: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={battingSquad !== undefined ? battingSquad : []}
                  filterBy={["name"]}
                  placeholder="Type player name..."
                />
              </div>
            </div>
            <h5>{bowlingTeam}</h5>
            <div className="form-group row">
              <label htmlFor="bowler" className="col-sm-2 col-form-label">
                Bowler
              </label>
              <div className="col-sm-10">
                <Typeahead
                  labelKey="name"
                  onChange={selected => {
                    if (selected.length) {
                      let bowlerId;
                      if (has(selected[0], "customOption")) {
                        bowlerId = "";
                      } else {
                        bowlerId = selected[0].id;
                      }
                      this.setState({
                        bowler: {
                          id: bowlerId,
                          name: startCase(toLower(selected[0].name)),
                          teamName: bowlingTeam,
                          teamId: bowlingTeamId,
                          onStrike: true,
                          bowlingOrder: 1,
                          balls: 0,
                          wickets: 0,
                          wides: 0,
                          noBalls: 0,
                          runs: 0,
                          dots: 0,
                          byes: 0,
                          fours: 0,
                          sixes: 0,
                          eco: 0.0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={bowlingSquad !== undefined ? bowlingSquad : []}
                  filterBy={["name"]}
                  placeholder="Type player name..."
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Add Players</Button>{" "}
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default BatsmanModal;
