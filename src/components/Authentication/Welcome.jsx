import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc} from "firebase/firestore";

// Our database
import { users_colRef } from '../../firebase.js';

function Welcome({emailApp}) {

  const [full_name, setFull_name] = useState ("")
  const [role, setRole] = useState ("Developer")
  const [error, setError] = useState ("")

  const navigate = useNavigate ();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try{
      // Object to paste
      const docAdd = ({ 
        email: emailApp,
        full_name: full_name,
        role: role,
       })

      // Paste where email fits
      addDoc(users_colRef, docAdd)
      
      navigate ("/account")
    }

    catch (e) {
      console.log (e.message)
    }
  }

  return (
    <div className='max-w-[700px] mx-auto my-16 p-4'>
      <div>
        <h1 className='text-2xl font-bold py-2'>Welcome to Divine. Let´s get to know each other :)</h1>
      </div>

      

      <form id='welcome' className='welcome' onSubmit={handleSubmit}>

        <div className='flex flex-col py-2'>
          <label for="full_name" className="py-2 font-medium">Full name</label>
          <input name="full_name" onChange={(e) => setFull_name(e.target.value)} className='border p-3' type="text"></input>
        </div>

        <div className='flex flex-col py-2'>
          <label for="role" className="py-2 font-medium">Role</label>
          <select name="role" className='border p-3' id="role"  value={role} 
              onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Developer">Developer</option>
            <option value="Submitter">Submitter</option>
          </select>
        </div>

        

        <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white'>
          Get Started
        </button>

      </form>

      <script src="firebase"></script>
     
    </div>
  )
}

export default Welcome