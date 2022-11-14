import React, {useState, useEffect } from "react";

import { bugsColRef } from '../../firebase';
import { onSnapshot } from "firebase/firestore"

function CurrentIssue() {
  const [bugs, setBugs] = useState ()

  useEffect(() => {
    onSnapshot (bugsColRef, (snapshot) => {
      let allBugs = []
      snapshot.docs.forEach (bug => {
        allBugs.push ({ ...bug.data(), id: bug.id})
      })
  
      setBugs (allBugs)
  
    })

    
  }, [bugsColRef]);

  console.log (bugs)

  return (
    <div className="current-issues">

          {bugs !== undefined && bugs.map(bug => (
            <div className="indv-issue">
              <p className="close-issue">Close Isssue</p>
              <li key={bug.id}>{bug.assignTo}</li>
              <li key={bug.id}>{bug.priority}</li>
              <li key={bug.id}>{bug.title}</li>
              <li key={bug.id}>{bug.description}</li>
              <hr />
            </div>
            ))} 
        
    </div>
  );
}

export default CurrentIssue;
