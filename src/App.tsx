import React from 'react'
import logo from './logo.svg'
import './App.css'
import { useMetashare } from './hooks/metashare'
import { Helmet } from 'react-helmet'

const App = () => {
  const { peerCount, postCount, sendAll } = useMetashare()

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
        <p>
          posts: {postCount}
        </p>
        <button onClick={() => sendAll?.({
          type: 'response-post',
          id: 'tt1798709',
          data: [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ],
        })}
        >submit Movie
        </button>
      </header>
    </div>
  )
}

export default App
