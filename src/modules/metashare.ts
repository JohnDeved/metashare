import type { Peer } from 'p2pt'
import { p2pt } from './p2pt'
import idb from 'idb'
import type { IMetaMessage, IMetaRequestPost, IMetaRequestPosts, IMetaResponsePost, IMetaResponsePosts, IMetashareDB, IPostMeta } from '../types/metashare'

export const regex = {
  imdbId: /^tt\d{7}$/,
}

async function getDB () {
  return idb.openDB<IMetashareDB>('metashareDB', 1, {
    upgrade (db, oldv) {
      if (oldv < 1) {
        db.createObjectStore('posts')
      }
    },
  })
}

export const peers: Peer[] = []

interface IMetaHooks {
  setPeers: (peers: Peer[]) => void
  setPosts: (posts: string[]) => void
}

export async function metashare (hooks?: IMetaHooks) {
  console.log('starting metashare')
  const db = await getDB()

  p2pt.start()
  const postsIds = await db.getAllKeys('posts')
  hooks?.setPosts(postsIds)

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

  p2pt.on<Partial<IMetaMessage>>('msg', (peer, msg) => {
    switch (msg.type) {
      case 'request-posts':
        return handlePostsRequest(msg, peer)
      case 'request-post':
        return handlePostRequest(msg, peer)
      case 'response-posts':
        return handlePostsResponse(msg, peer)
      case 'response-post':
        return handlePostResponse(msg, peer)
    }
  })

  p2pt.on('trackerconnect', tracker => console.log('tracker connected', tracker.announceUrl))
  p2pt.on('trackerwarning', err => console.warn('tracker warning', err))

  async function handlePostsRequest (message: Partial<IMetaRequestPosts>, peer: Peer) {
    console.log('got posts request')
    const posts = await db.getAllKeys('posts')

    p2pt.send(peer, {
      type: 'response-posts',
      data: posts,
    })
  }

  async function handlePostRequest (message: Partial<IMetaRequestPost>, peer: Peer) {
    if (typeof message.id !== 'string') return

    console.log('got post request')
    const post = await db.get('posts', message.id)

    if (!post?.links) return
    if (!Array.isArray(post.links)) return
    if (!post.links.length) return

    p2pt.send(peer, {
      type: 'response-post',
      id: message.id,
      data: post.links,
    })
  }

  async function handlePostsResponse (message: Partial<IMetaResponsePosts>, peer: Peer) {
    const postIds = message.data
    if (!Array.isArray(postIds)) return
    console.log('got posts response', postsIds.length)

    for (const postId of postIds) {
      if (typeof postId !== 'string') continue
      if (!regex.imdbId.test(postId)) continue
      if (await db.get('posts', postId)) continue

      const meta = await getPostMeta(postId)
      if (!meta) continue
      console.log('saved post meta', postId, meta)
      await db.put('posts', meta, postId)
    }
  }

  async function handlePostResponse (message: Partial<IMetaResponsePost>, peer: Peer) {
    const postId = message.id
    if (!postId) return
    const links = message.data
    if (!Array.isArray(links)) return
    console.log('got post response', postId)

    const meta = await getPostMeta(postId)
    if (!meta) return

    const post = {
      image: meta.image,
      title: meta.title,
      description: meta.description,
      links,
    }
    console.log('saved post', postId, post)
    await db.put('posts', post, postId)
  }

  async function getPostMeta (id: string) {
    const url = `https://metascrape.vercel.app/api?url=https://www.imdb.com/title/${id}/`
    const res = await fetch(url).then<IPostMeta>(res => res.json())

    if (res.status.code !== 200) return
    if (res.meta['og:type'] !== 'video.movie') return

    return {
      image: res.meta['og:image'],
      title: res.meta['og:title'],
      description: res.meta['og:description'],
    }
  }
}
