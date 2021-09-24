import P2PT from 'p2pt'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createMetaStore } from './meta'

export const p2pt = new P2PT([
  'wss://tracker.fastcast.nz/',
  'wss://tracker.openwebtorrent.com/',
  'wss://tracker.btorrent.xyz/',
  'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
], 'metashare')

const { Provider: P2PTProvider, useHook: useP2PT } = createMetaStore(() => {
  const p2ptRef = useRef(p2pt)
  const [peersCount, setPeersCount] = useState(0)
  const [seederCount, setSeederCount] = useState(0)

  const updateStats = useCallback(() => {
    const stats = p2ptRef.current.getTrackerStats()

    setPeersCount(stats.connected)
    setSeederCount(stats.total)
  }, [p2ptRef])

  useEffect(() => {
    console.log('registered peer events')
    p2ptRef.current.on('peerconnect', updateStats)
    p2ptRef.current.on('peerclose', updateStats)
    p2ptRef.current.on('trackerconnect', updateStats)
    p2ptRef.current.on('trackerwarning', updateStats)
  }, [p2ptRef, updateStats])

  return {
    peersCount,
    seederCount,
    p2pt: p2ptRef.current,
  }
})

export {
  P2PTProvider,
  useP2PT,
}
