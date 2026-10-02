export type RawPostCategory = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  url?: string | null;
  type?: string | null;
};

export type RawPostThumbnail = {
  path?: string | null;
  original?: string | null;
};

export type RawPostContentStructure = {
  post_content?: Array<{
    content?: string | null;
  }> | null;
};

/** Post cơ bản (title, slug, dates, categories). */
export type RawPost = {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  published_at?: string | null;
  release_at?: string | null;
  created_at?: string | null;
  categories?: RawPostCategory[] | null;
};

/** Post kèm thumbnail (featured-news, member-connection). */
export type RawPostWithThumbnail = RawPost & {
  thumbnail?: RawPostThumbnail | null;
};

/** Post kèm nội dung (summary/content/content_structure). */
export type RawPostWithContent = RawPost & {
  summary?: string | null;
  content?: string | null;
  content_structure?: RawPostContentStructure | null;
};

/** Post sự kiện (kèm thumbnail + started_at). */
export type RawEventPost = RawPostWithThumbnail &
  RawPostWithContent & {
    started_at?: string | null;
  };

/** Post sự kiện đầy đủ cho lịch sự kiện (started/ended/registration/location...). */
export type RawEventCalendarPost = RawEventPost & {
  ended_at?: string | null;
  registration_deadline?: string | null;
  location?: string | null;
  participation_fee?: string | null;
  expired_at?: string | null;
  is_featured?: boolean | null;
  is_hidden?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
  type?: string | null;
  event_dates?: string[] | null;
};
