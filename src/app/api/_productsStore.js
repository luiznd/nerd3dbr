// Armazenamento simples em memória para produtos em desenvolvimento, com persistência em disco
import fs from 'fs';
import path from 'path';
import { mockProducts as defaultProducts } from './products/mockData';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'dev-products.json');

function ensureProductsFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      // Inicializa com os produtos mock para facilitar o desenvolvimento
      fs.writeFileSync(
        PRODUCTS_FILE,
        JSON.stringify({ products: defaultProducts }, null, 2),
        'utf-8'
      );
    }
  } catch (e) {
    console.warn('Dev products store: não foi possível garantir arquivo de dados:', e?.message);
  }
}

function loadProductsFromDisk() {
  try {
    ensureProductsFile();
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.products)) {
      return parsed;
    }
  } catch (e) {
    console.warn('Dev products store: falha ao carregar arquivo de dados:', e?.message);
  }
  return { products: defaultProducts };
}

const initial = globalThis.__nerd3d_products_store || loadProductsFromDisk();
globalThis.__nerd3d_products_store = initial;

export function getProductsStore() {
  return globalThis.__nerd3d_products_store;
}

export function saveProductsStore() {
  try {
    ensureProductsFile();
    fs.writeFileSync(
      PRODUCTS_FILE,
      JSON.stringify(globalThis.__nerd3d_products_store, null, 2),
      'utf-8'
    );
  } catch (e) {
    console.warn('Dev products store: falha ao salvar arquivo de dados:', e?.message);
  }
}

export function listProducts({ category, q } = {}) {
  const store = getProductsStore();
  let list = store.products || [];
  if (category) list = list.filter((p) => p.category === category);
  if (q) {
    const query = String(q).toLowerCase();
    list = list.filter((p) =>
      `${p.name} ${p.description} ${(p.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query)
    );
  }
  return list;
}

export function addProduct(input) {
  const store = getProductsStore();
  const now = new Date().toISOString();
  const id = input?.id || `p-${Date.now()}`;
  const product = {
    id,
    name: input.name,
    description: input.description || '',
    price: Number(input.price || 0),
    images: Array.isArray(input.images) ? input.images : [],
    category: input.category || 'Outros',
    tags: Array.isArray(input.tags) ? input.tags : [],
    inStock: Number(input.inStock || 0),
    isDigital: !!input.isDigital,
    fileUrl: input.fileUrl || undefined,
    dimensions: input.dimensions || undefined,
    weight: typeof input.weight !== 'undefined' ? Number(input.weight) : undefined,
    createdAt: now,
    updatedAt: now,
  };
  store.products.push(product);
  saveProductsStore();
  return product;
}

export function findProductById(id) {
  const store = getProductsStore();
  return (store.products || []).find((p) => p.id === id);
}

export function updateProductById(id, patch) {
  const store = getProductsStore();
  const idx = (store.products || []).findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const prev = store.products[idx];
  const next = {
    ...prev,
    ...patch,
    price: typeof patch.price !== 'undefined' ? Number(patch.price) : prev.price,
    inStock: typeof patch.inStock !== 'undefined' ? Number(patch.inStock) : prev.inStock,
    weight: typeof patch.weight !== 'undefined' ? Number(patch.weight) : prev.weight,
    updatedAt: now,
  };
  store.products[idx] = next;
  saveProductsStore();
  return next;
}

export function deleteProductById(id) {
  const store = getProductsStore();
  const before = store.products.length;
  store.products = (store.products || []).filter((p) => p.id !== id);
  const removed = store.products.length < before;
  if (removed) saveProductsStore();
  return removed;
}

export default initial;

