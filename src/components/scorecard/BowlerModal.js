import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import { has, startCase, toLower, find, isEmpty } from "lodash";

class BowlerModal extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    bowler: {}
  };

  render() {
    const {
      openModal,
      toggle,
      submitBowler,
      bowlingSquad,
      bowlingTeam,
      bowlingTeamId
    } = this.props;
    const { bowler } = this.state;
    return (
      <Modal isOpen={openModal} className={this.props.className}>
        <ModalHeader>Change Bowler</ModalHeader>
        <form
          onSubmit={e => {
            submitBowler(e, this.state.bowler);
          }}
          autoComplete="off"
          className="m-0 p-0"
        >
          <ModalBody>
            <h5>Bowling Team: {bowlingTeam}</h5>
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
                          bowlingOrder: 2,
                          balls: 0,
                          wickets: 0,
                          wides: 0,
                          noBalls: 0,
                          runs: 0,
                          dots: 0,
                          byes: 0,
                          fours: 0,
                          sixes: 0,
                          eco: 0
                        }
                      });
                    }
                  }}
                  allowNew={true}
                  options={bowlingSquad !== undefined ? bowlingSquad : []}
                  filterBy={["name"]}
                  placeholder="Type player name..."
                  newSelectionPrefix="Choose : "
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={isEmpty(bowler)}>
              Change Bowler
            </Button>{" "}
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default BowlerModal;
