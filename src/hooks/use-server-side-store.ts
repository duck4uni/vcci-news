// useStore.ts
import { useState, useEffect } from 'react'

const useServerSideStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
  initData?: F
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F | undefined>(initData)

  useEffect(() => setData(result), [result])

  return data as F
}

export default useServerSideStore
