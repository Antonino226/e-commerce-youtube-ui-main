import { FileHandle } from "./file-handle.model";

export interface Category {
    categoryId: number
    categoryName: string,
    categoryDescription: string,
    categoryImages: FileHandle[]
  }