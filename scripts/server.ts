import { metashare } from '../src/modules/metashare'
import fetch from 'node-fetch'
import setGlobalVars from 'indexeddbshim'

globalThis.fetch = fetch
global.window = global as any
setGlobalVars(global.window, {checkOrigin: false})
metashare()
