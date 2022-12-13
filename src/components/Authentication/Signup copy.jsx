import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"

const Signup = ({ setEmailApp }) => {

  const [email, setEmail] = useState ("")
  const [username, setUsername] = useState ("")
  const [password, setPassword] = useState ("")
  const [error, setError] = useState ("")
  const {createUser} = UserAuth();
  const navigate = useNavigate ();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try{
      setEmailApp (email)
      await createUser (username, email, password)
      navigate ("/welcome")
    }
    catch (e) {
      console.log (e.message)
    }
  }

  return (
    <div className='max-w-[700px] mx-auto my-16 p-4'>
      <div>
        <h1 className='text-2xl font-bold py-2'>Sign up for a free account</h1>
        <p className='py-2'>
          Already have an account yet?{' '}
          <Link to='/' className='underline'>
            Login.
          </Link>
        </p>
      </div>

      <form id='signup' className='signup' onSubmit={handleSubmit}>

      <div className='flex flex-col py-2'>
          <label for="username" className="py-2 font-medium">Username</label>
          <input onChange={(e) => setUsername(e.target.value)} className='border p-3' type="text"></input>
        </div>

        <div className='flex flex-col py-2'>
          <label for="email" className="py-2 font-medium">Email Adress</label>
          <input name='email' onChange={(e) => setEmail(e.target.value)} className='border p-3' type="email"></input>
        </div>

        <div className='flex flex-col py-2'>
          <label className="py-2 font-medium">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} className='border p-3' type="password"></input>
        </div>

        

        <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white'>
          Sign Up
        </button>

      </form>
     
    </div>
  );
};

export default Signup;