import React, { Component } from 'react';
import { Form,
        FormGroup,
        Input,
        Button,
        Col 
    } from 'reactstrap';

export class Tournment extends Component {
    state = {
        name: "",
        startDate: "",
        Fee: "",
        firstprize: "",
        secondprize: "",
        sponsors: "",
        totalteams: ""
      };
      handleSubmit = e => {
        e.preventDefault();
        this.props.signUp(this.state);
      };
  render() {
    return (


      <div className="container">
            <Form onSubmit={this.handleSubmit}>
        <h2 className="border-bottom pb-2">Create Tournment</h2>
      <FormGroup row>
      <label for='name' sm={2}>Name</label>
      <Input 
            type='text' 
            id='name' 
            name='name' 
            placeholder='Enter the Name' />
        </FormGroup>
        <FormGroup row>
        <label for='startDate' sm={2}>Start Date</label>
        <Input 
            type='date' 
            id='date' 
            value='date' />
        </FormGroup>
        <FormGroup>
        <label for='Fee'>Fee</label>
        <Input 
            type='text' 
            id='fee' 
            name='fee' 
            placeholder='Enter the Fee'/>
        </FormGroup>
        <FormGroup row>
        <label for='firstPrize' sm={2}>First Prize</label>
        <Input 
            type='text' 
            name='firstprize' 
            id='firstprize' />
        </FormGroup>
        <FormGroup row>
        <label for='secondPrize'>Second Prize</label>
        <Input 
            type='text' 
            name='secondprize' 
            id='secondprize' />
        </FormGroup>
        <FormGroup row>
        <label for='sponsors'>Sponsors</label>
        <Input 
            type='text' 
            name='sponsor' 
            id='sponsor' 
            placeholder='Enter the Sponsor Details' />
        </FormGroup>
        <FormGroup row>
            <label for='totalTeams'>Total Teams</label>
            <Input 
            type='text' 
            name='totalteams' 
            id='totalteams' />
        </FormGroup>
        <FormGroup row>
            <Col>
              <Button color="primary">Login</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>



    )
  }
}

export default Tournment
