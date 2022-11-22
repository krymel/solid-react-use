import { parseCookie } from 'solid-start/session'
import { ServerContext } from 'solid-start/server'
import { useContext } from 'solid-js'
import { isServer } from 'solid-js/web'

export const useCookies = () => {
  const context = useContext(ServerContext)
  const cookies = isServer ? context.request.headers.get('Cookie') : document.cookie
  return parseCookie(cookies ?? '')
}

export const useCookie = <T>(key: string, defaultState?: T): T => {
  const cookies = useCookies()
  return cookies?.[key] ? JSON.parse(cookies[key]) : defaultState
}
