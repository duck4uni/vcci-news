// // Core
// import { decrypt, encrypt } from './crypto'
// import { PersistStorage, StorageValue } from 'zustand/middleware'
// import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
// // App
// import envConfig from './env-config'

// export async function getItem(name: string) {
//   const cipherText = getCookie(name)
//   // const cipherText = localStorage.getItem(name)
//   if (!cipherText) return null

//   const originalText = await decrypt(cipherText, envConfig.SECRET_KEY, envConfig.BUFFER_KEY)
//   if (!originalText) return null

//   return JSON.parse(originalText)
// }

// export async function setItem<S>(name: string, value: StorageValue<S>) {
//   const cipherText = await encrypt(JSON.stringify(value), envConfig.SECRET_KEY, envConfig.BUFFER_KEY)
//   setCookie(name, cipherText)
//   localStorage.setItem(name, cipherText)
// }

// export async function removeItem(name: string) {
//   removeCookie(name)
//   localStorage.removeItem(name)
// }

// // Utils
// // Create storage
// export const createStorage = <S>(): PersistStorage<S> => {
//   return {
//     getItem,
//     setItem,
//     removeItem
//   }
// }
