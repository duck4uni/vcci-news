import { Buffer } from 'buffer'

export async function encrypt(dataToEncrypt: string, keyString: string, bufferString: string) {
  const ivBuffer = Buffer.from(bufferString, 'base64')
  const key = await getKey(keyString)
  const dataBuffer = new TextEncoder().encode(dataToEncrypt)
  const encryptedData = await encryptData(dataBuffer, key, ivBuffer)

  return Buffer.from(encryptedData).toString('base64')
}

export async function decrypt(encryptedDataString: string, keyString: string, bufferString: string) {
  const key = await getKey(keyString)
  const encryptedBuffer = Buffer.from(encryptedDataString, 'base64')
  const ivBuffer = Buffer.from(bufferString, 'base64')
  const decryptedBuffer = await decryptData(encryptedBuffer, key, ivBuffer)
  return new TextDecoder().decode(decryptedBuffer)
}

// ======================================= HELPER FUNCTIONS ================================

const getKey = async (encryptionKey: string) => {
  return await crypto.subtle.importKey(
    'raw',
    Buffer.from(encryptionKey),
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

const encryptData = async (dataBuffer: BufferSource, key: CryptoKey, ivBuffer: BufferSource) => {
  return await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer
    },
    key,
    dataBuffer
  )
}

const decryptData = async (encryptedDataBuffer: BufferSource, key: CryptoKey, ivBuffer: BufferSource) => {
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer
    },
    key,
    encryptedDataBuffer
  )
}
