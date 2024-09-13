export interface CategoryItem {
  key: string;
  label: string;
  count: number;
  fa_class: string;
}

export interface FacetsResponse {
  page: number;
  page_size: number;
  start: number;
  total: number;
  topics: {
    items: CategoryItem[];
  };
}

export interface ScrollEvent {
  to: number;
}