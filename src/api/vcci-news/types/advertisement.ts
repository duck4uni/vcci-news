/** Loại quảng cáo: vuông (sidebar) hoặc ngang (banner full-width) */
export type AdvertisementType = "square" | "horizontal";

/** Chế độ hiển thị */
export type AdvertisementStatus = "active" | "inactive";

export interface AdvertisementItem {
  id: string;
  /** Tên quảng cáo */
  name: string;
  /** Đường dẫn ảnh (có thể là .gif) */
  image: string;
  /** Alt text cho ảnh */
  alt: string;
  /** Đường link khi bấm vào */
  link: string;
  /** Loại quảng cáo: vuông | ngang */
  type: AdvertisementType;
  /** Chế độ hiển thị */
  status: AdvertisementStatus;
  /** Thứ tự hiển thị (số nhỏ hiện trước) */
  sortOrder: number;
  /** Ngày tạo (ISO string) */
  createdAt: string;
  /** Tạo bởi ai */
  createdBy: string;
  /** Ngày sửa (ISO string) */
  updatedAt: string;
  /** Sửa bởi ai */
  updatedBy: string;
}

export interface AdvertisementFormValues {
  id?: string;
  name: string;
  image: string;
  alt: string;
  link: string;
  type: AdvertisementType;
  status: AdvertisementStatus;
  sortOrder: number;
}
