import React, { useEffect, useState } from "react";

import AddTeam from "./AddTeam.jsx";
import CurrentTeam from "./CurrentTeam.jsx";

import {UserAuth} from "../../context/AuthContext"
import { users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";


function Index() {
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState()


  useEffect(() => {
    {user && setMail(user.email)}
  }, [user]);

  const [addTeam, setTeam] = useState(false);

  function showaddTeam() {
    setTeam(true);
  }

  function showCurrentTeam() {
    setTeam(false);
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