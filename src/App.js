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
          
          
          <AuthContextProvider>
          {currentUser !== undefined && <Sidebar isSidebar={isSidebar} />}
            
            

            <main className="content">
              {currentUser !== undefined && <Topbar setIsSidebar={setIsSidebar} />}

              
                
                <Routes>
                  
                  <Route path='/login' element={<Login setEmailApp={setEmailApp} />} /> &&
                  <Route  path='/signup' element={<Signup setEmailApp={setEmailApp} />} /> &&
                  <Route  path="/welcome" element ={<Welcome emailApp={emailApp}/>}/>
                  

                  {currentUser !== undefined &&   
                  <Route path='/home' element={
                    <ProtectedRoute>
                      <HomeSignedIn />
                  </ProtectedRoute>}/>
                  }

                  {currentUser !== undefined &&
                  <Route path='/dashboard' element={
                    <ProtectedRoute>
                      <Dashboard />
                  </ProtectedRoute>}/>
                  }

                  {currentUser !== undefined &&
                  <Route path="/issues/*" element={
                    <ProtectedRoute>
                      <Issues2 />
                  </ProtectedRoute>}/>
                  }

                  {currentUser !== undefined &&
                  <Route path='/projects' element={
                    <ProtectedRoute>
                      <Projects />
                  </ProtectedRoute>}/>
                  }

                  {currentUser !== undefined &&
                  <Route path='/team' element={
                    <ProtectedRoute>
                    <Team/>
                  </ProtectedRoute>}/>
                  }

                  {currentUser !== undefined &&
                  <Route path='/account' element={ 
                  <ProtectedRoute> 
                    <Account /> 
                  </ProtectedRoute>}/>
                  }

                  


                  
                </Routes>
              
            </main>
            </AuthContextProvider>

          </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;