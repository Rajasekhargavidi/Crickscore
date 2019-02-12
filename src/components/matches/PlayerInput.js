import React from "react";
import moment from "moment";

const PlayerInput = ({ number, handleChange }) => {
  return (
    <div className="form-group row">
      <label htmlFor={`addPlayer${number}`} className="col-sm-2 col-form-label">
        Add Player {number}
      </label>
      <div className="col-sm-10">
        <input
          type="text"
          className="form-control"
          id={`addPlayer${number}`}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PlayerInput;
