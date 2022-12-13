import React, { useState } from "react";
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

import Home from "./components/Home/home";

import Issues2 from "./scenes/issues/index"
import Projects from "./scenes/projects/index"

import { Route, Routes, Switch } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const [theme, colorMode] = useMode ();
  const [isSidebar, setIsSidebar] = useState(true);
  const [emailApp, setEmailApp] = useState ("")

  return ( 
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>

          <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <AuthContextProvider>
            
            

            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />

              
                
                <Routes>
                  <Route path='/login' element={<Login setEmailApp={setEmailApp} />} />
                  <Route  path='/signup' element={<Signup setEmailApp={setEmailApp} />} />
                  <Route  path="/welcome" element ={<Welcome emailApp={emailApp}/>}/>


                  <Route path='/' element={
                    <ProtectedRoute>
                      <Home />
                  </ProtectedRoute>}/>

                  <Route path='/dashboard' element={
                    <ProtectedRoute>
                      <Dashboard />
                  </ProtectedRoute>}/>

                  <Route path='/issues' element={
                    <ProtectedRoute>
                      <Issues2 />
                  </ProtectedRoute>}/>

                  <Route path='/projects' element={
                    <ProtectedRoute>
                      <Projects />
                  </ProtectedRoute>}/>

                  <Route path='/team' element={
                    <ProtectedRoute>
                    <Team/>
                  </ProtectedRoute>}/>

                  <Route path='/account' element={ 
                  <ProtectedRoute> 
                    <Account /> 
                  </ProtectedRoute>}/>
                  
                  
                </Routes>
              
            </main>
            </AuthContextProvider>

          </div>

      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;