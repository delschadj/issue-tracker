import AddIssue from "./AddIsssue.jsx";
import CurrentIssue from "./CurrentIssue.jsx";

import React, { useState } from "react";

function Issues() {
  const [addIssue, setAddIssue] = useState(false);

  function showAddIssue() {
    setAddIssue(true);
  }

  function showCurrentIssue() {
    setAddIssue(false);
  }

  return (
    <div className="Issues">
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

export default Issues;