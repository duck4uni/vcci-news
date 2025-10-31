export interface SearchParams<Key extends string = string> extends URLSearchParams {
  get: (name: Key) => string | null
}
