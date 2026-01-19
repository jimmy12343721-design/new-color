export interface WorkItem {
  id: number;
  file: string;
  label: string;
}

export interface Category {
  name: string;
  prefix: string;
  count: number;
}

export interface WorkCategoryDef {
  title: string;
  range: [number, number];
}

export type ViewState = 'home' | 'simulator';

export interface GlassInfo {
  [key: string]: string;
}