// Armazenamento simples em memória para desenvolvimento, com persistência em disco
// Compartilhado entre rotas via cache de módulo
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'dev-orders.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ orders: [] }, null, 2), 'utf-8');
    }
  } catch (e) {
    // Em dev, podemos ignorar falhas de persistência
    console.warn('Dev store: não foi possível garantir arquivo de dados:', e?.message);
  }
}

function loadStoreFromDisk() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.orders)) {
      return parsed;
    }
  } catch (e) {
    console.warn('Dev store: falha ao carregar arquivo de dados:', e?.message);
  }
  return { orders: [] };
}

const initial = globalThis.__nerd3d_store || loadStoreFromDisk();
globalThis.__nerd3d_store = initial;

export function getStore() {
  return globalThis.__nerd3d_store;
}

export function saveStore() {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(globalThis.__nerd3d_store, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Dev store: falha ao salvar arquivo de dados:', e?.message);
  }
}

export function addOrder(order) {
  const store = getStore();
  store.orders.push(order);
  saveStore();
  return order;
}

export function findOrderById(id) {
  const store = getStore();
  return store.orders.find(o => o.id === id);
}

export default initial;
