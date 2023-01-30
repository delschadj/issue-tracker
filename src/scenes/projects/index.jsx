import React, { useEffect, useState } from "react";
import AddProject from "./AddProject.jsx";
import CurrentProjects from "./CurrentProject.jsx";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "@mui/material";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";


function Index() {
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)

  const [addProject, setProject] = useState(false);

  function showAddProject() {
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
        {addProject ? 
          <>
            <AddProject 
              button={
              <Button onClick={() => showCurrentProjects()} 
                type="submit" variant="contained"> 
                <ArrowBackIcon/>  Back to current Projects
              </Button >
              }/> 
          </>
          
          : 


          <>
          <CurrentProjects 
            button={
            <Button style={{ marginTop: "3vh" }} onClick={() => showAddProject()} 
              type="submit" variant="contained"> 
                Add Project 
            </Button >}/>
        </>
          }
      </div>







      
      
    </div>
  );
}

export default Index;