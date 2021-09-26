import type { Peer } from 'p2pt'
import { useRef, useState, useCallback, useEffect } from 'react'
import { metashare, getDB } from '../modules/metashare'
import { p2pt } from '../modules/p2pt'
import type { IMetaMessage } from '../types/metashare'
import { createMetaStore } from './meta'
import { useAsync } from 'react-use'

const { Provider: MetashareProvider, useHook: useMetashare } = createMetaStore(() => {
  const p2ptRef = useRef(p2pt)
  const [peers, setPeers] = useState<Peer[]>([])
  const [posts, setPosts] = useState<string[]>([])

  const sendAll = useCallback((data: IMetaMessage) => {
    for (const peer of peers) {
      p2pt.send(peer, data).catch(console.error)
    }
  }, [peers])

  useEffect(() => {
    console.log('register metashare hooks')

    metashare({
      setPeers,
      setPosts,
    })
  }, [p2pt])

  return {
    p2pt: p2ptRef.current,
    peers,
    peerCount: peers.length,
    posts,
    postCount: posts.length,
    sendAll,
  }
})

export {
  MetashareProvider,
  useMetashare,
}

export function usePostMeta (id: string) {
  return useAsync(async () => {
    const db = await getDB()
    return db.get('posts', id)
  }, [id])
}
