import type { Peer } from 'p2pt'
import { useRef, useState, useCallback, useEffect } from 'react'
import { metashare } from '../modules/metashare'
import { p2pt } from '../modules/p2pt'
import { createMetaStore } from './meta'

const { Provider: MetashareProvider, useHook: useMetashare } = createMetaStore(() => {
  const p2ptRef = useRef(p2pt)
  const [peers, setPeers] = useState<Peer[]>([])

  const sendAll = useCallback((data: Object) => {
    for (const peer of peers) {
      p2pt.send(peer, data)
    }
  }, [peers])

  useEffect(() => {
    console.log('register metashare hooks')

    metashare({
      setPeers,
    })
  }, [p2pt])

  return {
    p2pt: p2ptRef.current,
    peers,
    peerCount: peers.length,
    sendAll,
  }
})

export {
  MetashareProvider,
  useMetashare,
}
