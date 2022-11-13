import AddIssue from "../AddIssue/AddIsssue";
import CurrentIssue from "../CurrentIssue/CurrentIssue";

import React, { useState } from "react";

function Home() {
  const [addIssue, setAddIssue] = useState(true);

  function showAddIssue() {
    setAddIssue(true);
  }

  function showCurrentIssue() {
    setAddIssue(false);
  }

  return (
    <div className="Home">
      <h1>Issue Tracker</h1>
      <div className="grey-card-contianer">
        {addIssue ? <AddIssue /> : <CurrentIssue />}
      </div>
      <div className="view-selection-div">
        <button class="view-button" onClick={() => showCurrentIssue()}>
          Current Issues
        </button>
        <button
          class="view-button active-button"
          onClick={() => showAddIssue()}
        >
          Add Issue
        </button>
      </div>
    </div>
  );
}

export default Home;