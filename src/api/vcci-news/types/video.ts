export interface VideoItem {
  id: string;
  name: string;
  url: string;
}

export interface VideoFormValues {
  id?: string;
  name: string;
  url: string;
}

export type RawVideo = {
  id?: string | null;
  name?: string | null;
  url?: string | null;
};
