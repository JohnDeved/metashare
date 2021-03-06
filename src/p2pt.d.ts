declare module 'p2pt' {
  export default class P2PT extends EventEmitter {
    constructor (announceURLs?: string[], identifierString?: string)
    setIdentifier (identifierString: string): void
    start (): void
    addTracker (announceURL: string)
    removeTracker (announceURL: string)
    send <T = Object>(peer: Peer, msg: T, msgID?: string): Promise<any>
    requestMorePeers (): Promise<Peer[]>
    getTrackerStats (): {
      connected: number
      total: number
    }
    destroy ()

    on (event: 'peerconnect', listener: (peer: Peer) => void): this
    on (event: 'peerclose', listener: (peer: Peer) => void): this
    on <T = Object>(event: 'data', listener: (peer: Peer, data: T) => void): this
    on <T = Object>(event: 'msg', listener: (peer: Peer, msg: T) => void): this
    on (event: 'trackerconnect', listener: (tracker: WebSocketTracker, stats) => void): this
    on (event: 'trackerwarning', listener: (Error: Error, stats) => void): this
  }

  export interface Peer {
    readable: boolean
    writable: boolean
    allowHalfOpen: boolean
    _id: string
    channelName: string
    initiator: boolean
    streams: any[]
    trickle: boolean
    allowHalfTrickle: boolean
    iceCompleteTimeout: number
    destroying: boolean
    id: string
  }

  export interface WebSocketTracker {
    announceUrl: string
  }
}
