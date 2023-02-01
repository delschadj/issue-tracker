import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";

import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/dashboard";
import Team from "./scenes/team/index";


import Login from "./components/Authentication/Login";
import Signup from './components/Authentication/Signup';
import Account from './components/Authentication/Account';
import Welcome from "./components/Authentication/Welcome";

import HomeSignedIn from "./components/Home/home";

import Issues2 from "./scenes/issues/index"
import Projects from "./scenes/projects/index"

import { Route, Routes, Switch } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./App.css";

function App() {
  const [theme, colorMode] = useMode ();
  const [isSidebar, setIsSidebar] = useState(true);
  const [emailApp, setEmailApp] = useState ("")
  const [currentUser, setCurrentUser] = useState ()

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        setCurrentUser (user)

      } else {

        setCurrentUser (undefined)

      }
    }); 
  }, [currentUser]);

  return ( 
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>

          <div className="app">

          <Login setEmailApp={setEmailApp} />
          
          
          

          </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;