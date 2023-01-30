import React, { useState } from "react";
import AddIssue from "./AddIsssue.jsx";
import CurrentIssue from "./CurrentIssue.jsx";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "@mui/material";

function Index() {
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
        {addIssue ? 
        <>
          <AddIssue 
            button={
            <Button onClick={() => showCurrentIssue()} 
              type="submit" variant="contained"> 
              <ArrowBackIcon/>  Back to current Issues 
            </Button >
            }/> 
        </>
        
        : 

        <>
          <CurrentIssue 
            button={
            <Button style={{ marginTop: "3vh" }} onClick={() => showAddIssue()} 
              type="submit" variant="contained"> 
                Add issue 
            </Button >}/>
        </>
         }
      </div>      
    </div>
  );
}

export default Index;