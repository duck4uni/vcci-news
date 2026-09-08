import type { DynamicCategoryRouteItem, DynamicPostItem } from "../../types";

export type LegalTradePageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem;
};

export type LegalTradeSection = {
  title: string;
  description?: string;
  bullets?: string[];
  numbered?: string[];
};

export type LegalTradeTemplate = {
  pageTitle: string;
  intro?: string;
  sections: LegalTradeSection[];
  sideCard?: {
    title: string;
    items: string[];
  };
};
