import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase.js';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const createUser = async (name, email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
        console.log(err)
      );
      await sendEmailVerification(auth.currentUser).catch((err) =>
        console.log(err)
      );
      await updateProfile(auth.currentUser, { displayName: name }).catch(
        (err) => console.log(err)
      );
    } catch (err) {
      console.log(err);
    }
  };

   const signIn = (email, full_name, username, religion, password) =>  {
    return signInWithEmailAndPassword(auth, email, full_name, username, religion, password)
   }

  const logout = () => {
      return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};