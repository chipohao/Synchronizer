import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Tone from "tone";

export default () => {
  const [Id, setTitle] = useState("");
  const [seconds, setSeconds] = useState(0);
  const currentCount = seconds;
  const synth = new Tone.Synth().toDestination();

  //just demo, define your own mapping here
  var noteMapping = {
    1: "C3",
    2: "D3",
    3: "E3",
    4: "F3",
    5: "G3",
  };

  const processInstruction = (data) => {
    console.log(data);
    if (data["Instruction"] in noteMapping) {
      console.log(data["Instruction"]);
      synth.triggerAttackRelease(noteMapping[data["Instruction"]], "4n");
      //synth.triggerAttackRelease("C4", "4n");
    }
  };

  const startTimer = async () => {
    setInterval(async () => {
      setSeconds((seconds) => seconds + 1);
      //no function implement in /getMusicNow, every client share same behavior
      const r = await axios.post(`http://127.0.0.1:8080/getMusic`, {
        userId: Id,
      });
      processInstruction(r.data);

      //console.log(r.data);
    }, 1000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    //no function implement in /getMusicNow, every client share same behavior
    const r = await axios.post(`http://127.0.0.1:8080/registId`, {
      userId: Id,
    });
    //setTitle(Id);
    startTimer();
    console.log(r.data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Your Id</label>
          <input
            value={Id}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Start2</button>
        <p id="counter">{currentCount}</p>
      </form>
    </div>
  );
};
