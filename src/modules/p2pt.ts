import P2PT from 'p2pt'

export const p2pt = new P2PT([
  'wss://tracker.openwebtorrent.com/',
  'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
  'wss://metashare.up.railway.app/',
  'wss://metashare-server.herokuapp.com/',
], 'metashare')
