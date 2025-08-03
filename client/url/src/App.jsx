import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './auth/Login'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './auth/Signup'
import UrlShortener from './Urlshortner'
import ShortenerUrl from './components/ShortenerUrl'
// import StatsPage from './components/StatsPage'


function App() {

  
  const appRouter = createBrowserRouter([

    {
      path: "/",
      element: <Login />,

    },
     {
      path: "/signup",
      element: <Signup />,

    },
     {
      path: "/shorten",
      element: <ShortenerUrl/>,

    },
 
    


  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
