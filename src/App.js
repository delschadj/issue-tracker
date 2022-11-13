import React, { useState } from "react";
import Login from "./components/Authentication/Login";
import Signup from './components/Authentication/Signup';
import Account from './components/Authentication/Account';
import Welcome from "./components/Authentication/Welcome";

import AddIssue from "./components/AddIssue/AddIsssue";
import CurrentIssue from "./components/CurrentIssue/CurrentIssue";

import { Route, Routes, Switch } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const [emailApp, setEmailApp] = useState ("")

  return (
    <div>
      
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Login setEmailApp={setEmailApp} />} />
          <Route  path='/signup' element={<Signup setEmailApp={setEmailApp} />} />
          <Route  path="/welcome" element ={<Welcome emailApp={emailApp}/>}/>


          <Route path='/home' element={
            <ProtectedRoute>
              <AddIssue />
          </ProtectedRoute>}/>

          

          <Route path='/account' element={ 
          <ProtectedRoute> 
            <Account /> 
          </ProtectedRoute>}/>
          
          
        </Routes>
      </AuthContextProvider>
    </div>
  );
}


export default App;
