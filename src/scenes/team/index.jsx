import React, { useEffect, useState } from "react";
import AddTeam from "./AddTeam.jsx";
import CurrentTeam from "./CurrentTeam.jsx";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from "@mui/material";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { getDocs, onSnapshot, collection, query, where } from "firebase/firestore";


function Index() {
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()

  const [addTeam, setTeam] = useState(false);

  function showAddTeam() {
    setTeam(true);
  }

  function showCurrentTeam() {
    setTeam(false);
  }

  // Get current user once
  useEffect(()=> {
    
    const loadRabbit = async () => {
      const q = query(users_colRef, where("email", "==", user.email));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setCurrentUser (doc.data())
        
      });
    }

    loadRabbit();
    
  }, [user]);

  return (
    <div className="Issues">
      <div className="grey-card-contianer">
        {addTeam ? 
        <>
          <AddTeam 
            button={
            <Button onClick={() => showCurrentTeam()} 
              type="submit" variant="contained"> 
              <ArrowBackIcon/>  Back to current Team
            </Button >
            }/> 
        </>
        
        : 

        <>
          <CurrentTeam 
            button={
            <Button style={{ marginTop: "3vh" }} onClick={() => showAddTeam()} 
              type="submit" variant="contained"> 
                Add Team Member 
            </Button >}/>
        </>
         }
      </div>      
    </div>
  );
}

export default Index;