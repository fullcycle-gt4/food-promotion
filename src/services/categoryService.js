import seed from '../mocks/categories.json';
import { mock } from './http';

export const categoryService = {
  // GET /categories
  list() {
    return mock(seed);
  },
};
