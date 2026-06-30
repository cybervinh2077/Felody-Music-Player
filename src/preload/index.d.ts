import { FelodyAPI } from './index'

declare global {
  interface Window {
    api: FelodyAPI
  }
}
