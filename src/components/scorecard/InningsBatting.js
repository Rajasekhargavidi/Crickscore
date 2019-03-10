import React from "react";
import { Table } from "reactstrap";

const InningsBatting = ({ players }) => {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th colspan="2">Batsman</th>
          <th>Runs</th>
          <th>Balls</th>
          <th>4s</th>
          <th>6s</th>
          <th>0s</th>
          <th>SR</th>
        </tr>
      </thead>
      <tbody>
        {players &&
          players.map((player, index) => (
            <tr key={index}>
              <th scope="row">
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
      </tbody>
    </Table>
  );
};

export default InningsBatting;
