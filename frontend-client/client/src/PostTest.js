import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Tone from "tone";

export default () => {
  const [Id, setTitle] = useState("");
  const [seconds, setSeconds] = useState(0);
  const currentCount = seconds;
  const synth = new Tone.Synth().toMaster();

  //just demo, define your own mapping here
  var noteMapping = {
    1: "C3",
    2: "D3",
    3: "E3",
    4: "F3",
    5: "G3",
  };
  const startTimer = async () => {
    setInterval(async () => {
      setSeconds((seconds) => seconds + 1);
      //no function implement in /getMusicNow, every client share same behavior
      const r = await axios.post(`http://127.0.0.1:8080/getMusic`, {
        userId: Id,
      });
      if (r.data["Instruction"] in noteMapping) {
        //just demo, define your own behavior here
        synth.triggerAttackRelease(noteMapping[r.data["Instruction"]], "4n");
      }
      console.log(r.data);
    }, 1000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    //no function implement in /getMusicNow, every client share same behavior
    const r = await axios.post(`http://127.0.0.1:8080/RegistId`, {
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
