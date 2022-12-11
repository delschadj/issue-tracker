import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom"

import Popup from 'react-popup';

const root = ReactDOM.createRoot (document.getElementById("root"))

root.render (
<BrowserRouter>
  <App> 
  <Popup />,
    document.getElementById('popupContainer')
  </App>
  
</BrowserRouter>);