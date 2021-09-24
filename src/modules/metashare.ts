import type { Peer } from 'p2pt'
import { p2pt } from './p2pt'

export const peers: Peer[] = []

interface metaHooks {
  setPeers: (peers: Peer[]) => void
}

export function metashare (hooks?: metaHooks) {
  console.log('starting metashare')
  p2pt.start()

  p2pt.on('peerconnect', (peer) => {
    console.log('peer connected', peer.id)
    if (!peers.find(p => p.id === peer.id)) {
      peers.push(peer)
      hooks?.setPeers([...peers])
    }
  })

  p2pt.on('peerclose', (peer) => {
    const peerIndex = peers.indexOf(peer)
    if (peerIndex !== -1) {
      console.log('peer disconnected', peer.id)
      peers.splice(peerIndex, 1)
      hooks?.setPeers([...peers])
    }
  })
}
