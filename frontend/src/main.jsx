import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router, RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import { Provider } from 'react-redux'
import { UserProvider } from './context/Usercontext';
  ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      </UserProvider>
    //  </React.StrictMode>
  )

