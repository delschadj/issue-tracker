import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import AddProject from "./AddProject.jsx";
import CurrentProjects from "./CurrentProject.jsx";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";


function Index() {
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)

  const [addProject, setProject] = useState(false);

  function showaddProject() {
    setProject(true);
  }

  function showCurrentProjects() {
    setProject(false);
  }

  // Get current user
  useEffect(()=> {
    setMail (user.email)
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", mail));

      const unsubscribe = onSnapshot (q, (snapshot) => {
        const currentUserArray = []
        snapshot.docs.forEach (doc => {
          currentUserArray.push ({ ...doc.data(), id: doc.id})
        });
    
        setCurrentUser (currentUserArray[0])
    
        unsubscribe();
      })
    }

    loadRabbit();
    
  }, [mail]);
  

  return (
    <div className="Issues">
      <div className="grey-card-contianer">
        {addProject ? <AddProject /> : <CurrentProjects />}
      </div>

      {currentUser.role !== undefined && currentUser.role==="Admin" &&
        <div className="view-selection-div">
          <button class="view-button" onClick={() => showCurrentProjects()}>
            Current Projects
          </button>
          <button
            class="view-button active-button"
            onClick={() => showaddProject()}
          >
            Add Project
          </button>
        </div>
      }
      
    </div>
  );
}

export default Index;