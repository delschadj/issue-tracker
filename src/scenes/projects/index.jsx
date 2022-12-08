import AddProject from "./AddProject.jsx";
import CurrentIssue from "./CurrentProject.jsx";

import React, { useState } from "react";

function Index() {
  const [addProject, setProject] = useState(false);

  function showaddProject() {
    setProject(true);
  }

  function showCurrentIssue() {
    setProject(false);
  }

  return (
    <div className="Issues">
      <div className="grey-card-contianer">
        {addProject ? <AddProject /> : <CurrentIssue />}
      </div>
      <div className="view-selection-div">
        <button class="view-button" onClick={() => showCurrentIssue()}>
          Current Projects
        </button>
        <button
          class="view-button active-button"
          onClick={() => showaddProject()}
        >
          Add Project
        </button>
      </div>
    </div>
  );
}

export default Index;