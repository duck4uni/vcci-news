export interface UserSummary {
  id: string
  email: string
  username: string | null
  first_name: string | null
  last_name: string | null
  full_name: string
  avatar_url: string | null
}

export interface RawUser {
  id?: string | null
  email?: string | null
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
  avatar_url?: string | null
}
