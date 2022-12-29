// Generate four random hex digits.
import Cookies from 'js-cookie'

export const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

// Generate a pseudo-GUID by concatenating random hexadecimal.
export const guid = () => {
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const TOKEN_KEY = 'token'
export const USER_KEY = 'USER_INFO'

let token = null
let user = null
/**
 * 保存JWT Token
 * @param {token} tk
 */
export const setToken = tk => {
  if (tk) {
    Cookies.set(TOKEN_KEY, tk, {
      expires: 1
    })
    token = tk
  } else {
    token = ''
    Cookies.set(TOKEN_KEY, '', -1)
  }
}

export const getToken = () => {
  if (token) {
    return token
  } else {
    token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
  }
}

export const setUser = us => {
  if (us) {
    localStorage.setItem(USER_KEY, JSON.stringify(us))
    user = us
  } else {
    user = null
    localStorage.setItem(USER_KEY, '')
  }
}

export const getUser = () => {
  if (user) {
    return user
  } else {
    user = JSON.parse(localStorage.getItem(USER_KEY))
    if (user) return user
    else return false
  }
}
