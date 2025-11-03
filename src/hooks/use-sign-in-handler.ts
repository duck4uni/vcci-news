// import type { SignInMutationData } from '@api/types/auth'
// import type { User } from '@api/models/user'
// import { set } from 'date-fns'
// import { usePostApiAuthenticate, useGetApiAuthenticateGetMyInfo } from '@api/endpoints/authenticate'
// import { useShallow } from 'zustand/react/shallow'
// import useAuthStore from '@stores/auth'
// import useProfileStore from '@stores/profile'
// import { useCallback, useMemo } from 'react'
const useSignInHandler = () => {
  // Mutations
  // const { mutateAsync: signIn } = usePostApiAuthenticate()
  // const { refetch: getMyInfo } = useGetApiAuthenticateGetMyInfo<{ user: User }>({
  //   query: {
  //     enabled: false,
  //     queryKey: []
  //   }
  // })
  // // Stores
  // const authStore = useAuthStore(
  //   useShallow(({ storedUsername, storedPassword, setStore }) => ({
  //     storedUsername,
  //     storedPassword,
  //     setStore
  //   }))
  // )
  // const setProfileStore = useProfileStore((state) => state.setStore)
  // // Basic Sign in
  // const defaultValue = useMemo(
  //   () => ({
  //     username: authStore.storedUsername ?? '',
  //     password: authStore.storedPassword ?? ''
  //   }),
  //   []
  // )
  // const setUserInfo = useCallback(async () => {
  //   const { data: myInfo } = await getMyInfo()
  //   if (myInfo?.user) setProfileStore(myInfo.user)
  //   return true
  // }, [])
  // const signInHandler = useCallback(
  //   async (fieldValues: { username: string; password: string; isStoreAccount: boolean }) => {
  //     try {
  //       const response = (await signIn({
  //         data: {
  //           username: fieldValues.username,
  //           password: fieldValues.password
  //         }
  //       })) as unknown as SignInMutationData
  //       authStore.setStore({ token: response.token })
  //       authStore.setStore({
  //         isSignedIn: true,
  //         expiredAt: set(new Date(), { hours: 23, minutes: 59, seconds: 59 }),
  //         storedUsername: fieldValues.isStoreAccount ? fieldValues.username : null,
  //         storedPassword: fieldValues.isStoreAccount ? fieldValues.password : null
  //       })
  //       await setUserInfo()
  //     } catch (error) {
  //       authStore.setStore({ token: null })
  //       throw error
  //     }
  //   },
  //   []
  // )
  // // External Sign in
  // const broadcastChannel = useMemo(() => new BroadcastChannel('ext-signin'), [])
  // const onSelectGoogleSignIn = useCallback((redirect_url: string) => {
  //   const popup = window.open(`${window.origin}${redirect_url}`, '_blank', 'popup=true,width=800,height=600')
  //   if (!popup) return
  //   // Listen to login message
  //   return { broadcastChannel, popup }
  // }, [])
  // const onGoogleRedirectResponse = useCallback(async (message: { error?: string; message?: string }) => {
  //   broadcastChannel.postMessage(message)
  // }, [])
  // return {
  //   // Basic Sign in
  //   defaultValue,
  //   signInHandler,
  //   // External Sign In
  //   onSelectGoogleSignIn,
  //   onGoogleRedirectResponse,
  //   setUserInfo
  // }
}

export default useSignInHandler
