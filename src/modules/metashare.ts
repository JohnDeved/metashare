import type { Peer } from 'p2pt'
import { p2pt } from './p2pt'
import * as idb from 'idb'
import type { IMetaMessage, IMetaRequestPost, IMetaResponsePost, IMetaResponsePosts, IMetashareDB, IPostMeta } from '../types/metashare'

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

  p2pt.on('peerconnect', async (peer) => {
    console.log('peer connected', peer.id)
    if (!peers.find(p => p.id === peer.id)) {
      peers.push(peer)
      hooks?.setPeers([...peers])

      const postIds = await db.getAllKeys('posts')
      if (!postIds.length) return

      handlePostsRequest(peer)
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
        return handlePostsRequest(peer)
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

  async function handlePostsRequest (peer: Peer) {
    const posts = await db.getAllKeys('posts')

    p2pt.send(peer, {
      type: 'response-posts',
      data: posts,
    }).catch(console.error)
  }

  async function handlePostRequest (message: Partial<IMetaRequestPost>, peer: Peer) {
    if (typeof message.id !== 'string') return
    if (!regex.imdbId.test(message.id)) return

    console.log('got post request', message.id)
    const post = await db.get('posts', message.id)

    if (!post?.links) return
    if (!Array.isArray(post.links)) return
    if (!post.links.length) return

    p2pt.send(peer, {
      type: 'response-post',
      id: message.id,
      data: post.links,
    }).catch(console.error)
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
      await db.put('posts', meta, postId)
      console.log('saved post meta', postId, meta)
      hooks?.setPosts(await db.getAllKeys('posts'))

      for (const peer of peers) {
        p2pt.send(peer, {
          type: 'request-post',
          id: postId,
        }).catch(console.error)
      }
    }
  }

  async function handlePostResponse (message: Partial<IMetaResponsePost>, peer: Peer) {
    const postId = message.id
    if (!postId) return
    const links = message.data
    if (!Array.isArray(links)) return
    let prePost = await db.get('posts', postId)
    if (prePost) {
      if (prePost.links) {
        const oldLinks = prePost.links
        // todo: check if link is regex valid
        const newLinks = links.filter(link => !oldLinks.includes(link))
        if (newLinks.length === 0) return
      }
    }

    if (!prePost?.image) prePost = await getPostMeta(postId)
    if (!prePost) return
    console.log('got post response', postId)

    const post = {
      image: prePost.image,
      title: prePost.title,
      description: prePost.description,
      links,
    }
    await db.put('posts', post, postId)
    console.log('saved post', postId, post)
    hooks?.setPosts(await db.getAllKeys('posts'))
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
