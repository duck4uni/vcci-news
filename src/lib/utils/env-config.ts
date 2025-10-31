// import { z } from 'zod'

// const envConfigSchema = z.object({
//   BUFFER_KEY: z.string().min(1),
//   SECRET_KEY: z.string().min(1)
// })

//  Process env is for nextjs, import meta for vite
// const envConfigParser = envConfigSchema.safeParse({
//   BUFFER_KEY: typeof process != 'undefined' ? process.env.FOSCO_BUFFER : import.meta.env.FOSCO_BUFFER,
//   SECRET_KEY: typeof process != 'undefined' ? process.env.FOSCO_SECRET : import.meta.env.FOSCO_SECRET
// })

// if (!envConfigParser.success) {
//   console.error(envConfigParser.error.issues)
//   throw new Error('Invalid .env variable values')
// }

// export const envConfig = envConfigParser.data
// export default envConfig
