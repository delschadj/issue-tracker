import React, { useEffect, useState } from "react";
import Multiselect from 'multiselect-react-dropdown';

import {UserAuth} from "../../context/AuthContext"
import { projectsColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot, collection, query, where } from "firebase/firestore";

function AddProject() {

  const [users, setUsers] = useState ("")
  const [devs, setDevs] = useState ()
  
  const [title, setTitle] = useState ("")
  const [description, setDescription] = useState ("")

  const [projectManager, setProjectManager] = useState ("")
  const [assignTo, setAssignTo] = useState ([])
  const [priority, setPriority] = useState ("")

  const [error, setError] = useState ("");

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


  // Get all users
  useEffect(() => {
    onSnapshot (users_colRef, (snapshot) => {
      let allUsers = []
      snapshot.docs.forEach (user => {
        allUsers.push ({ ...user.data(), id: user.id})
      })
  
      setUsers (allUsers)
  
    })

    
  }, [users_colRef]);

  
  // Get all devs
  const q = query(users_colRef, where("role", "==", "Developer"));
  useEffect(() => {
    onSnapshot (q, (snapshot) => {
      let allDevs = []
      snapshot.docs.forEach (dev => {
        allDevs.push (dev.data().full_name)
        
        
      })
  
      setDevs (allDevs)

    })
 
  }, [users_colRef]);



  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try{
      // Object to paste
      const docAdd = ({ 
        title: title,
        description: description,

        projectManager: projectManager,
        assignTo: assignTo,
        priority: priority,
       })

      // Paste
      addDoc(projectsColRef, docAdd)
      alert ("Success!")
    }

    catch (e) {
      console.log (e.message)
    }
  }


  return (
    <>
    {currentUser.role === "Admin" && 
    <div className="add-issue">
      <form>

      <label>
          Title

          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            placeholder="Title" />

        </label>

        <label>
          Description
          <input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description of Project" />
        </label>

        <label>
          Project Manager
          <select name="assignTo" onChange={(e) => setProjectManager(e.target.value)}>
          {Array.isArray(users) && users.filter(function (user) {
            return user.role === "Project Manager"
          }).map(user => (
              <option value={user.full_name}>{user.full_name}</option>
            ))}
          </select>
        </label>

        <label>
          Assign to
          <div>
              <Multiselect
              isObject={false}
              options={devs}
              />
          </div>
        </label>
        
        <label>
          Priority
          <select name="priority" onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Extra-High">Extra-High</option>
          </select>
        </label>

        <button type="submit" onClick={handleSubmit}>Add</button>
      </form>
    </div>}

    {currentUser.role !== "Admin" &&
    <div>
    <h1> Your current projects </h1>  
    </div>}

    </>
      
    
    
  );
}

export default AddProject;
