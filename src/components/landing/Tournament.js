import React, { Component } from 'react';
import { Form,
        FormGroup,
        Input,
        Button,
        Col 
    } from 'reactstrap';
    import { connect } from 'react-redux'
    import { createTeam } from '../.././store/actions/auth'
    import { Redirect } from 'react-router-dom'

class Tournament extends Component {
    state = {
        name: "",
        startDate: "",
        Fee: "",
        firstprize: "",
        secondprize: "",
        sponsors: "",
        totalteams: ""
      };
      handleChange = e => {
        this.setState({ [e.target.id]: e.target.value });
      };
      handleSubmit = e => {
        e.preventDefault();
        this.props.createTaem(this.state);
      };
  render() {
    const { auth, createTeamError } = this.props;
    if (auth.uid) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
            <Form onSubmit={this.handleSubmit}>
        <h2 className="border-bottom pb-2">Create Tournament</h2>
      <FormGroup row>
      {createTeamError && <div class="error">{createTeamError}</div>}
      <label for='name' sm={2}>Name</label>
      <Input 
            type='text' 
            id='name' 
            name='name' 
            placeholder='Enter the Name'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup row>
        <label for='startDate' sm={2}>Start Date</label>
        <Input 
            type='date' 
            id='date' 
            value='date'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
        <label for='Fee'>Fee</label>
        <Input 
            type='text' 
            id='fee' 
            name='fee' 
            placeholder='Enter the Fee'
            onChange={this.handleChange}
            />
        </FormGroup>
        <FormGroup row>
        <label for='firstPrize' sm={2}>First Prize</label>
        <Input 
            type='text' 
            name='firstprize' 
            id='firstprize'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup row>
        <label for='secondPrize'>Second Prize</label>
        <Input 
            type='text' 
            name='secondprize' 
            id='secondprize'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup row>
        <label for='sponsors'>Sponsors</label>
        <Input 
            type='text' 
            name='sponsors' 
            id='sponsors' 
            placeholder='Enter the Sponsor Details'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup row>
            <label for='totalTeams'>Total Teams</label>
            <Input 
            type='text' 
            name='totalteams' 
            id='totalteams'
            onChange={this.handleChange} />
        </FormGroup>
        <FormGroup row>
            <Col>
              <Button color="primary">Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>



    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    createTeamError: state.auth.createTeamError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTeam: credentials => dispatch(createTeam(credentials))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tournament);


