import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { isEmpty } from "lodash";

class OutModal extends React.Component {
  state = {
    whoIsOut: {}
  };

  render() {
    const {
      openModal,
      toggle,
      striker,
      nonStriker,
      handleWhoIsOut
    } = this.props;
    const { whoIsOut } = this.state;
    return (
      <Modal
        isOpen={openModal}
        toggle={toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={toggle}>Who is out?</ModalHeader>
        <ModalBody>
          <FormGroup tag="fieldset">
            <legend>Select Batsman</legend>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="whoIsOut"
                  value={striker.id}
                  onChange={() => {
                    this.setState({ whoIsOut: striker });
                  }}
                />{" "}
                {striker.name}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="whoIsOut"
                  value={nonStriker.id}
                  onChange={() => {
                    this.setState({ whoIsOut: nonStriker });
                  }}
                />{" "}
                {nonStriker.name}
              </Label>
            </FormGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => handleWhoIsOut(whoIsOut)}
            disabled={isEmpty(whoIsOut)}
          >
            Okay
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default OutModal;
