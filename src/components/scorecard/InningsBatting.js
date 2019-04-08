import React from "react";
import { Table } from "reactstrap";

const InningsBatting = ({ players, finalScore }) => {
  return (
    <Table responsive size="sm">
      <thead>
        <tr>
          <th colSpan="2">Batsman</th>
          <th>R</th>
          <th>B</th>
          <th>4s</th>
          <th>6s</th>
          <th>0s</th>
          <th>SR</th>
        </tr>
      </thead>
      <tbody>
        {players &&
          players.map((player, index) => (
            <tr key={index} className="text-center">
              <th scope="row" className="text-left">
                {player.name}
                {player.onStrike ? "*" : ""}
              </th>
              <th scope="row">{player.out ? "out" : ""}</th>
              <td>{player.runs}</td>
              <td>{player.balls}</td>
              <td>{player.fours}</td>
              <td>{player.sixes}</td>
              <td>{player.dots}</td>
              <td>{player.sr}</td>
            </tr>
          ))}
        <tr>
          <td colSpan="3">
            <strong>Extras</strong>
          </td>
          <td colSpan="5">11 (lb 5, nb 2, w 4)</td>
        </tr>
        <tr>
          <td>
            <strong>Total</strong>
          </td>
          <td colSpan="7">{finalScore}</td>
        </tr>
        <tr>
          <td colSpan="8">
            <strong>Did not bat:</strong> P Chopra, K Gowtham, JC Archer, S
            Gopal, S Midhun, DS Kulkarni
          </td>
        </tr>
        <tr>
          <td colSpan="8">
            <strong>Fall of Wickets:</strong> 1-5 (AM Rahane, 1.1 ov), 2-77 (JC
            Buttler, 11.5 ov), 3-105 (RA Tripathi, 15.4 ov)
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default InningsBatting;
