import P2PT from 'p2pt'

export const p2pt = new P2PT([
  'wss://tracker.fastcast.nz/',
  'wss://tracker.openwebtorrent.com/',
  'wss://tracker.btorrent.xyz/',
  'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
], 'metashare')
