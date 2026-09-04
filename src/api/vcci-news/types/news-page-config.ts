export interface NewsPageConfigItem {
  id: string,
  name: string,
  code: string,
  static_link: string,
  is_article: boolean,
  level: number,
  sort_order: number,
  children: Array<NewsPageConfigItem>,
};

export interface GetNewsPageConfigResponseType {
  message: string,
  message_en: string,
  responseData: NewsPageConfigItem,
  status: string,
  timeStamp: string,
  violations: "null | Object",
};