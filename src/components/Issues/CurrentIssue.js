import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

// Our databases
import { users_colRef, issuesColRef } from '../../firebase.js';

function CurrentIssue() {
  const [error, setError] = useState()

  const [issues, setIssues] = useState ()
  const [currentUser, setCurrentUser] = useState ({})
  const {user, logout} = UserAuth()
  const [mail, setMail] = useState(user.email)
  const [priority, setPrio] = useState()

  console.log (currentUser) // Admin, Project Manager ...

  console.log (priority)

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
    onSnapshot (issuesColRef, (snapshot) => {
      let allissues = []
      snapshot.docs.forEach (issue => {
        allissues.push ({ ...issue.data(), id: issue.id})
      })
  
      setIssues (allissues)
  
    })
  }, [issuesColRef]);

  const deleteissue = async (e) => {
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

      <h1>Priority</h1>
      <button onClick={() => {setPrio("All")}} > All </button>
      <button onClick={() => {setPrio("Extra-High")}} > Extra-High </button>
      <button onClick={() => {setPrio("High")}}> High </button>
      <button onClick={() => {setPrio("Medium")}}> Medium </button>
      <button onClick={() => {setPrio("Low")}}> Low </button>

      <hr />

          {issues !== undefined && (currentUser.role === "Admin" || currentUser.role === "Project Manager") && issues.filter(function (issue) {
            if (priority === "All") return issue
          else return issue.priority===priority
          }).map(issue => (
            <div className="indv-issue">
              <button onClick={() => {deleteDoc(doc(issuesColRef,issue.id))}} className="close-issue">Close Isssue</button>
              <li key={issue.id}>{issue.assignTo}</li>
              <li key={issue.id}>{issue.priority}</li>
              <li key={issue.id}>{issue.title}</li>
              <li key={issue.id}>{issue.description}</li>
              <hr />
            </div>
          ))} 

          
          {issues !== undefined && currentUser.role !== "Admin" && currentUser.role !== "Project Manager" && issues.filter(function (issue) {
            if (priority === "All") return issue.assignTo === currentUser.full_name
            else return issue.assignTo === currentUser.full_name && issue.priority===priority
          }).map(issue => (
            <div className="indv-issue">
              <button onClick={() => {deleteDoc(doc(issuesColRef,issue.id))}} className="close-issue">Close Isssue</button>
              <li key={issue.id}>{issue.assignTo}</li>
              <li key={issue.id}>{issue.priority}</li>
              <li key={issue.id}>{issue.title}</li>
              <li key={issue.id}>{issue.description}</li>
              <hr />
            </div>
          )) }
        
    </div>
  );
}

export default CurrentIssue;
