import { getCategorias } from '../api.js';

let cachedCategories = null;

export const categoryService = {
  async list() {
    if (!cachedCategories) {
      cachedCategories = await getCategorias();
    }
    return cachedCategories;
  },
};
