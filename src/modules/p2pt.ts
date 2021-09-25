import P2PT from 'p2pt'

export const p2pt = new P2PT([
  'wss://tracker.openwebtorrent.com/',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.fastcast.nz',
  'wss://tracker.webtorrent.io',
  'wss://tracker.files.fm:7073/announce',
  'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
  'wss://peertube.cpy.re:443/tracker/socket',
  'ws://tracker.files.fm:7072/announce',
], 'metashare')
