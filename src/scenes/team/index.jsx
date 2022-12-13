import React, { useEffect, useState } from "react";

import AddTeam from "./AddTeam.jsx";
import CurrentTeam from "./CurrentTeam.jsx";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { getDocs, onSnapshot, collection, query, where } from "firebase/firestore";


function Index() {
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()

  const [addTeam, setTeam] = useState(false);

  function showaddTeam() {
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
        {addTeam ? <AddTeam /> : <CurrentTeam />}
      </div>

      {currentUser.role !== undefined && currentUser.role==="Admin" &&
        <div className="view-selection-div">
          <button class="view-button" onClick={() => showCurrentTeam()}>
            Current Team
          </button>
          <button
            class="view-button active-button"
            onClick={() => showaddTeam()}
          >
            Add Team Member
          </button>
        </div>
      }
      
    </div>
  );
}

export default Index;