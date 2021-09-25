import React from 'react'
import logo from './logo.svg'
import './App.css'
import { useMetashare } from './hooks/metashare'
import { Helmet } from 'react-helmet'

const App = () => {
  const { peerCount } = useMetashare()

  // console.log(peers)

  return (
    <div className="App">
      <Helmet>
        <title>MetaShare • {peerCount?.toString()} Peers</title>
      </Helmet>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          peers: {peerCount}
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
