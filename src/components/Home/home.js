import AddProject from "./AddProject";
import CurrentProjects from "./CurrentProjects";

import React, { useEffect, useState } from "react";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { onSnapshot, query, where } from "firebase/firestore";

function Home() {
  const [addIssue, setAddIssue] = useState(true);

  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)

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

  function showAddIssue() {
    setAddIssue(true);
  }

  function showCurrentIssue() {
    setAddIssue(false);
  }

  return (
    <div className="Home">

      <h1>HOME</h1>

      { 
        currentUser.role !== undefined && currentUser.role === "Admin" && 
        <div className="projects-admin">
        <h1>Project</h1>
        
          <div className="grey-card-contianer">
            {addIssue ? <AddProject /> : <CurrentProjects />}
          </div>
        
        <div className="view-selection-div">
          <button class="view-button" onClick={() => showCurrentIssue()}>
            Current Projects
          </button>
          <button
            class="view-button active-button"
            onClick={() => showAddIssue()}
          >
            Add Project
          </button>
        </div>
        </div>
    }

      { 
        currentUser.role !== undefined && currentUser.role == "Developer" && 
        <div className="projects-manager-devs">
          <h1>Current Projects</h1>
            <li>This should redirect to project 1</li>
            <li>This should redirect to project 2</li>
            <li>This should redirect to project 3</li>
        </div>
      }
      
    </div>

  );
}

export default Home;