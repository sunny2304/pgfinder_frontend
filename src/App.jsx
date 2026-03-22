import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router/AppRouter'
import axios from 'axios'
import {ToastContainer, Slide , Zoom} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import './App.css'

function App() {
  const [count, setCount] = useState(0)
  axios.defaults.baseURL = "http://localhost:3000/api"

  return (
    <>
      <AppRouter></AppRouter>

      <ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
  transition={Slide}
  toastStyle={{ marginTop: "70px" }} // adjust based on navbar height
/>
    </>
  )
}

export default App
