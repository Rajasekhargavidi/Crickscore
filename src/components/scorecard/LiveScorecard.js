import React, { Component } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { calculateOvers, calculateEco } from "../../utils";

const LiveScorecard = ({ striker, nonStriker, bowler }) => {
  if (striker && nonStriker && bowler) {
    return (
      <div className="container mt-3">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Batsman</th>
              <th scope="col">Runs</th>
              <th scope="col">Balls</th>
              <th scope="col">4s</th>
              <th scope="col">6s</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                {striker.name}
                <sup>*</sup>
              </th>
              <td>{striker.runs}</td>
              <td>{striker.balls}</td>
              <td>{striker.fours}</td>
              <td>{striker.sixes}</td>
            </tr>
            <tr>
              <th scope="row">{nonStriker.name}</th>
              <td>{nonStriker.runs}</td>
              <td>{nonStriker.balls}</td>
              <td>{nonStriker.fours}</td>
              <td>{nonStriker.sixes}</td>
            </tr>
          </tbody>
        </table>

        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Bowler</th>
              <th scope="col">Overs</th>
              <th scope="col">Runs</th>
              <th scope="col">Wickets</th>
              <th scope="col">Eco</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{bowler.name}</th>
              <td>{calculateOvers(bowler.balls)}</td>
              <td>{bowler.runs}</td>
              <td>{bowler.wickets}</td>
              <td>{calculateEco(bowler.runs, bowler.balls)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="container text-center">
        <p>Loading...</p>
      </div>
    );
  }
};

export default LiveScorecard;
