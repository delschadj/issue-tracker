import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

// Our databases
import { users_colRef, bugsColRef } from '../../firebase.js';

function CurrentIssue() {
  const [error, setError] = useState()

  const [bugs, setBugs] = useState ()
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)

  console.log (currentUser) // Admin, Project Manager ...

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

  useEffect(() => {
    onSnapshot (bugsColRef, (snapshot) => {
      let allBugs = []
      snapshot.docs.forEach (bug => {
        allBugs.push ({ ...bug.data(), id: bug.id})
      })
  
      setBugs (allBugs)
  
    })
  }, [bugsColRef]);

  const deleteBug = async (e) => {
    e.preventDefault()
    setError("")

    try{
      alert ("Succesfully deleted.")
    }

    catch (e) {
      console.log (e.message)
    }
  }

  return (
    <div className="current-issues">

          {bugs !== undefined && (currentUser.role === "Admin" || currentUser.role === "Project Manager") && bugs.map(bug => (
            <div className="indv-issue">
              <button onClick={() => {deleteDoc(doc(bugsColRef,bug.id))}} className="close-issue">Close Isssue</button>
              <li key={bug.id}>{bug.assignTo}</li>
              <li key={bug.id}>{bug.priority}</li>
              <li key={bug.id}>{bug.title}</li>
              <li key={bug.id}>{bug.description}</li>
              <hr />
            </div>
          ))} 

          
          {bugs !== undefined && currentUser.role !== "Admin" && currentUser.role !== "Project Manager" && bugs.filter(function (bug) {
          return bug.assignTo === currentUser.full_name;
          }).map(bug => (
            <div className="indv-issue">
              <button onClick={() => {deleteDoc(doc(bugsColRef,bug.id))}} className="close-issue">Close Isssue</button>
              <li key={bug.id}>{bug.assignTo}</li>
              <li key={bug.id}>{bug.priority}</li>
              <li key={bug.id}>{bug.title}</li>
              <li key={bug.id}>{bug.description}</li>
              <hr />
            </div>
          )) }
        
    </div>
  );
}

export default CurrentIssue;
