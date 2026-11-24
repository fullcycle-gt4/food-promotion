// Camada de transporte compartilhada.
// Mocks continuam disponíveis para áreas que ainda não possuem endpoints.
import { request as apiRequest } from '../api.js';

export const API_URL = import.meta.env.VITE_API_URL || '/api';
const DELAY = Number(import.meta.env.VITE_MOCK_DELAY ?? 300);

export function mock(data, { fail } = {}) {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error(fail)) : resolve(data === undefined ? data : structuredClone(data))), DELAY),
  );
}

export const request = apiRequest;

export const nextId = (list) => Math.max(0, ...list.map((i) => i.id)) + 1;
