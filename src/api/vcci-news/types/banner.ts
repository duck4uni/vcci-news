/**
 * Raw banner row trả về từ `GET /api/v1.0/banner`.
 */
export type RawBanner = {
  id: string;
  file_id?: string | null;
  banner_name?: string | null;
  image_url?: string | null;
  display_order?: number | null;
};
