import { Category, GlassInfo, WorkCategoryDef, WorkItem } from './types';

export const ASSET_BASE_URL = "https://raw.githubusercontent.com/jimmy12343721-design";
export const TEXTURE_REPO = `${ASSET_BASE_URL}/new-color/main/`;
export const TEXTURE_LARGE_REPO = `${ASSET_BASE_URL}/new-colorBIG/main/`;
export const SVG_REPO = `${ASSET_BASE_URL}/svg/main/`;

export const GLASS_INFO: GlassInfo = {
  "W01": "",
  "W02": "台灣早期壓花玻璃 | 海棠花 | 透明",
  "W03": "台灣早期壓花玻璃 | 十字紋 | 透明",
  "W04": "壓花玻璃 | 透明",
  "W05": "鏡子 | 背面為深色鏡子塗層",
  "W06": "全黑玻璃 | 不透光",
  "W07": "灰玻璃 | 透明"
};

export const TRANSPARENT_TEXTURE_IDS = [
  // B Series (All 12)
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12",
  // G Series (All 8)
  "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08",
  // R Series (Specific)
  "R01", "R02", "R08", "R09", "R15",
  // W Series (Specific)
  "W01", "W02", "W03", "W05", "W12"
];

export const CATEGORIES: Category[] = [
  { name: "W Series", prefix: "W", count: 14 },
  { name: "R Series", prefix: "R", count: 15 },
  { name: "G Series", prefix: "G", count: 8 },
  { name: "B Series", prefix: "B", count: 12 }
];

export const WORK_CATEGORIES: Record<string, WorkCategoryDef> = {
  ornaments: { title: "吊飾系列", range: [1, 10] },
  medium: { title: "中掛飾系列", range: [11, 14] },
  mirror: { title: "盒子／鏡子系列", range: [15, 19] },
  large_butterfly: { title: "大蝴蝶系列", range: [20, 22] },
  lamps: { title: "燈具系列", range: [23, 29] }
};

export const WORKS: WorkItem[] = [
  // 吊飾系列 1-10
  { id: 1, file: "01.svg", label: "小蝴蝶" },
  { id: 2, file: "02.svg", label: "幸運草" },
  { id: 3, file: "03.svg", label: "星星" },
  { id: 4, file: "04.svg", label: "愛心櫻桃" },
  { id: 5, file: "05.svg", label: "櫻桃" },
  { id: 6, file: "06.svg", label: "愛心緞帶" },
  { id: 7, file: "07.svg", label: "十字架" },
  { id: 8, file: "08.svg", label: "鬱金香" },
  { id: 9, file: "09.svg", label: "冰淇淋" },
  { id: 10, file: "10.svg", label: "仙人掌" },
  
  // 中掛飾系列 11-14
  { id: 11, file: "11.svg", label: "蝴蝶 ①" },
  { id: 12, file: "12.svg", label: "蝴蝶 ②" },
  { id: 13, file: "13.svg", label: "紙鶴" },
  { id: 14, file: "14.svg", label: "龜背芋" },
  
  // 盒子/鏡子系列 15-19
  { id: 15, file: "15.svg", label: "飾品盒" },
  { id: 16, file: "16.svg", label: "愛心手鏡" },
  { id: 17, file: "17.svg", label: "花花鏡" },
  { id: 18, file: "18.svg", label: "菱形鏡" },
  { id: 19, file: "19.svg", label: "盒鏡變化款" },
  
  // 大蝴蝶系列 20-22
  { id: 20, file: "20.svg", label: "大蝴蝶 A" },
  { id: 21, file: "21.svg", label: "大蝴蝶 B" },
  { id: 22, file: "22.svg", label: "大蝴蝶 C" },
  
  // 燈具系列 23-29
  { id: 23, file: "23.svg", label: "大燈 A" },
  { id: 24, file: "24.svg", label: "大燈 B" },
  { id: 25, file: "25.svg", label: "大燈 C" },
  { id: 26, file: "26.svg", label: "大燈 D" },
  { id: 27, file: "27.svg", label: "小燈 A" },
  { id: 28, file: "28.svg", label: "小燈 B" },
  { id: 29, file: "29.svg", label: "小燈 C" }
];