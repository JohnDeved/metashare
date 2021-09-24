import React from 'react'
import logo from './logo.svg'
import './App.css'
import { useP2PT } from './helper/p2pt'

const App = () => {
  const { peersCount, seederCount, p2pt } = useP2PT()

  console.log(p2pt)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          peers: {peersCount} seeder: {seederCount}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
