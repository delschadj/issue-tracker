import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserAuth} from "../../context/AuthContext"
import { query, where, onSnapshot } from "firebase/firestore";

// Our database
import { users_colRef, upload } from '../../firebase.js';

const Account = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState ({});
  const {user, logout} = UserAuth();
  const [mail, setMail] = useState(user.email);

  const [isBusy, setBusy] = useState(true)

  // Get current user once
  useEffect(()=> {
    
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

    setBusy(false);
    
  }, [mail]);


  const handleLogout = async () => {
    try {
      await logout()
      navigate ("/")
    }
    catch (e) {
      console.log (e.message)
    }
  }

  if (currentUser["email"] === null)
  {
    console.log ("Null error!")
  }

  return (
    <div>
      {isBusy ? ( <h1>Loading</h1>) : 
      (
      <div className='max-w-[600px] mx-auto my-16 p-4'>
      <h1 className='text-2xl font-bold py-4'>Account</h1>
      <p>User Email: {user && user.email}</p>
      <p>Full name: {user && currentUser["full_name"]}</p>
      <p>Username: {user && user.displayName}</p>
      <p>Role: {user && currentUser["role"]}</p>

      <button onClick={handleLogout} className='border px-6 py-2 my-4'> Logout </button>
      </div>
      )}
    </div>

    
  );
};

export default Account;