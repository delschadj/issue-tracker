import React, {useState, useEffect, useRef} from 'react';
import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";

// Our databases
import { users_colRef, projectsColRef } from '../../firebase.js';

function CurrentProjects() {
  const [error, setError] = useState()

  const [projects, setProjects] = useState ()
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
    onSnapshot (projectsColRef, (snapshot) => {
      let allProjects = []
      snapshot.docs.forEach (project => {
        allProjects.push ({ ...project.data(), id: project.id})
      })
  
      setProjects (allProjects)
  
    })
  }, [projectsColRef]);

  const deleteProject = async (e) => {
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
    <div className="current-project">

      <h1>Priority</h1>
      <button onClick={() => {setPrio("All")}} > All </button>
      <button onClick={() => {setPrio("Extra-High")}} > Extra-High </button>
      <button onClick={() => {setPrio("High")}}> High </button>
      <button onClick={() => {setPrio("Medium")}}> Medium </button>
      <button onClick={() => {setPrio("Low")}}> Low </button>

      <hr />

          {projects !== undefined && currentUser.role === "Admin" && projects.filter(function (project) {
            if (priority === "All") return project
          else return project.priority===priority
          }).map(project => (
            <div className="indv-project">
              <button onClick={() => {deleteDoc(doc(projectsColRef,project.id))}} className="close-project">Close Isssue</button>
              <li key={project.id}>{project.title}</li>
              <li key={project.id}>{project.description}</li>
              <li key={project.id}>{project.assignTo}</li>
              <li key={project.id}>{project.priority}</li>
              <hr />
            </div>
          ))} 

          
          {projects !== undefined && currentUser.role === "Project Manager" && projects.filter(function (project) {
            if (priority === "All") return project.prjectManager === currentUser.full_name
            else return project.assignTo === currentUser.full_name && priority.priority===priority
          }).map(priority => (
            <div className="indv-priority">
              <button onClick={() => {deleteDoc(doc(projectsColRef,priority.id))}} className="close-priority">Close Isssue</button>
              <li key={priority.id}>{priority.assignTo}</li>
              <li key={priority.id}>{priority.priority}</li>
              <li key={priority.id}>{priority.title}</li>
              <li key={priority.id}>{priority.description}</li>
              <hr />
            </div>
          )) }
        
    </div>
  );
}

export default CurrentProjects;
