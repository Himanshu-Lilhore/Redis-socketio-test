import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client";
import Axios from 'axios'
const socket = io(import.meta.env.VITE_BACKEND_URL);
Axios.defaults.withCredentials = true;

function App() {
  const [input, setInput] = useState('')
  const timer = useRef()

  function handleChange(val) {
    clearTimeout(timer.current);
    setInput(val);

    timer.current = setTimeout(async () => {
      try {
        socket.emit('change', val);
        console.log("New value set.")
      } catch (err) {
        console.log(err);
      }
    }, 500)
  }

  useEffect(() => {

    socket.emit('connection')

    socket.on('connection', (val) => {
      console.log('Received from server:', val);
      setInput(val);
    })

    socket.on('change', (val) => {
      console.log('Received from server:', val);
        setInput(val);
    })
  }, [])


  return (
    <>
      <div>
        <a>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{input}</h1>
      <div className="card">
        <input style={{height:'1.5rem', borderRadius: '0.3rem', padding: '5px', minWidth: '20rem', textAlign: 'center', backgroundColor:'white', color: 'black', fontWeight: 500, fontSize: '1.125rem'}} 
        onChange={(e) => handleChange(e.target.value)} value={input}></input>
      </div>
    </>
  )
}

export default App
