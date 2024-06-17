/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";

interface SleepFormProperties {
  onSave: () => void;
  onCancel: () => void;
}

export function SleepFormComponent({ onSave, onCancel }: SleepFormProperties) {
  const [dateGoToBed, setDateGoToBed] = useState<string>("");
  const [dateGoToGetUp, setdateGoToGetUp] = useState<string>("");
  const [timeInBed, setTimeInBed] = useState<string>("");
  const [timeOutOfBed, setTimeOutOfBed] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const bedTimeStart = `${dateGoToBed} ${timeInBed}`;
    const bedTimeEnd = `${dateGoToGetUp} ${timeOutOfBed}`;

    let feelingValue: number | null = null;
    switch (feeling) {
      case "Bad": {
        feelingValue = 1;

        break;
      }
      case "OK": {
        feelingValue = 2;

        break;
      }
      case "Good": {
        feelingValue = 3;

        break;
      }
      default: {
        feelingValue = null;
      }
    }

    const response = await fetch("http://localhost:8000/api/sleep-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token b58b602c1912e9432cbd0be58b9761040775bc3a"
      },
      body: JSON.stringify({ bedTimeStart, bedTimeEnd, feeling: feelingValue })
    });

    if (response.ok) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={dateGoToBed}
          onChange={(event) => setDateGoToBed(event.target.value)}
          required
        />
      </div>
      <div>
        <label>Time went to bed:</label>
        <input
          type="time"
          value={timeInBed}
          onChange={(event) => setTimeInBed(event.target.value)}
          required
        />
      </div>
      <div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={dateGoToGetUp}
            onChange={(event) => setdateGoToGetUp(event.target.value)}
            required
          />
        </div>
        <label>Time got up:</label>
        <input
          type="time"
          value={timeOutOfBed}
          onChange={(event) => setTimeOutOfBed(event.target.value)}
          required
        />
      </div>
      <div>
        <label>How you felt:</label>
        <select
          value={feeling}
          onChange={(event) => setFeeling(event.target.value)}
        >
          <option value="">Select</option>
          <option value="Bad">Bad</option>
          <option value="OK">OK</option>
          <option value="Good">Good</option>
        </select>
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
