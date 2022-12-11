import AddIssue from "./AddIsssue.jsx";
import CurrentIssue from "./CurrentIssue.jsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import React, { useState } from "react";
import { Button } from "@mui/material";

import Popup from 'react-popup';

function Index() {
  const [addIssue, setAddIssue] = useState(false);

  function showAddIssue() {
    Popup.alert('I am alert, nice to meet you');
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
          <AddIssue button={<Button onClick={() => showCurrentIssue()} type="submit" variant="contained"> <ArrowBackIcon/>  Back to current issues </Button >}/> 
        </>
        
        : 

        <>
          <CurrentIssue button={<Button onClick={() => showAddIssue()} type="submit" variant="contained"> Add issue </Button >}/>
        </>
         }
      </div>      
    </div>
  );
}

export default Index;