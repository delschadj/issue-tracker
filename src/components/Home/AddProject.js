import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getAuth } from "firebase/auth";
import { issuesColRef, users_colRef } from '../../firebase';
import { addDoc, onSnapshot } from "firebase/firestore";

function AddProject() {

  const [users, setUsers] = useState ("")
  
  const [title, setTitle] = useState ("")
  const [description, setDescription] = useState ("")

  const [projectManager, setProjectManager] = useState ("")
  const [assignTo, setAssignTo] = useState ([])
  const [priority, setPriority] = useState ("")

  const [error, setError] = useState ("")

  const auth = getAuth();
  const user = auth.currentUser;

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
      addDoc(issuesColRef, docAdd)
      alert ("Success!")
    }

    catch (e) {
      console.log (e.message)
    }
  }


  return (
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
          <select name="assignTo" onChange={(e) => setAssignTo(e.target.value)}>
          {Array.isArray(users) && users.map(user => (
              <option value={user.full_name}>{user.full_name}</option>
              
            
            ))} 
          </select>
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
    </div>
  );
}

export default AddProject;
