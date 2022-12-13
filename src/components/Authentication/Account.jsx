import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { query, where, getDocs } from "firebase/firestore";

// Our database
import { users_colRef } from '../../firebase.js';

const Account = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();

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


  const handleLogout = async () => {
    try {
      await logout()
      navigate ("/login")
    }
    catch (e) {
      console.log (e.message)
    }
  }


  return (
    <div>
      <div className='max-w-[600px] mx-auto my-16 p-4'>
      <h1 className='text-2xl font-bold py-4'>Account</h1>
      <p>User Email: {user && user.email}</p>
      <p>Full name: {user && currentUser["full_name"]}</p>
      <p>Role: {user && currentUser["role"]}</p>

      <button onClick={handleLogout} className='border px-6 py-2 my-4'> Logout </button>
      </div>
    </div>

    
  );
};

export default Account;