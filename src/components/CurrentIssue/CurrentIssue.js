import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot } from "firebase/firestore";

// Our databases
import { users_colRef, bugsColRef } from '../../firebase.js';

function CurrentIssue() {
  const [bugs, setBugs] = useState ()

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();
  const [mail, setMail] = useState(user.email);

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

  console.log ("Current User Role:" + currentUser.role)
  console.log ("mail:" + mail)

  useEffect(() => {
    onSnapshot (bugsColRef, (snapshot) => {
      let allBugs = []
      snapshot.docs.forEach (bug => {
        allBugs.push ({ ...bug.data(), id: bug.id})
      })
  
      setBugs (allBugs)
  
    })

    
  }, [bugsColRef]);

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
