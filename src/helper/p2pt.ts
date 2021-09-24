 import P2PT from 'p2pt'

 export const p2pt = new P2PT([
  "wss://tracker.openwebtorrent.com",
  "wss://tracker.novage.com.ua:443/",
  'wss://spacetradersapi-chatbox.herokuapp.com:443/announce',
  'wss://peertube.cpy.re:443/tracker/socket',
], 'metashare')