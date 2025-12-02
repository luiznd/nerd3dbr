// Armazenamento simples em memória para usuários em desenvolvimento, com persistência em disco
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'dev-users.json');

const defaultUsers = [
  {
    id: 'u-1',
    name: 'Admin Demo',
    email: 'admin@nerd3dbr.dev',
    role: 'admin',
    blocked: false,
    phone: '',
    // Campos de endereço (mantemos address para compatibilidade)
    address: '',
    addressStreet: '',
    addressNumber: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressComplement: '',
    cep: '',
    country: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u-2',
    name: 'Usuário Demo',
    email: 'user@nerd3dbr.dev',
    role: 'user',
    blocked: false,
    phone: '',
    address: '',
    addressStreet: '',
    addressNumber: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressComplement: '',
    cep: '',
    country: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ensureUsersFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(
        USERS_FILE,
        JSON.stringify({ users: defaultUsers }, null, 2),
        'utf-8'
      );
    }
  } catch (e) {
    console.warn('Dev users store: não foi possível garantir arquivo de dados:', e?.message);
  }
}

function loadUsersFromDisk() {
  try {
    ensureUsersFile();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw || '{}');
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.users)) {
      return parsed;
    }
  } catch (e) {
    console.warn('Dev users store: falha ao carregar arquivo de dados:', e?.message);
  }
  return { users: defaultUsers };
}

const initial = globalThis.__nerd3d_users_store || loadUsersFromDisk();
globalThis.__nerd3d_users_store = initial;

export function getUsersStore() {
  return globalThis.__nerd3d_users_store;
}

export function saveUsersStore() {
  try {
    ensureUsersFile();
    fs.writeFileSync(
      USERS_FILE,
      JSON.stringify(globalThis.__nerd3d_users_store, null, 2),
      'utf-8'
    );
  } catch (e) {
    console.warn('Dev users store: falha ao salvar arquivo de dados:', e?.message);
  }
}

export function listUsers({ search, role, blocked } = {}) {
  const store = getUsersStore();
  let list = store.users || [];
  if (role) list = list.filter((u) => String(u.role) === String(role));
  if (typeof blocked !== 'undefined' && blocked !== '') {
    const flag = String(blocked).toLowerCase();
    if (flag === 'true' || flag === '1') list = list.filter((u) => !!u.blocked);
    else if (flag === 'false' || flag === '0') list = list.filter((u) => !u.blocked);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((u) => (
      `${u.name} ${u.email} ${u.phone || ''} ${u.address || ''} ${u.addressStreet || ''} ${u.addressNumber || ''} ${u.addressNeighborhood || ''} ${u.addressCity || ''} ${u.addressState || ''} ${u.addressComplement || ''} ${u.cep || ''} ${u.country || ''}`
        .toLowerCase()
        .includes(q)
    ));
  }
  return list;
}

export function findUserById(id) {
  const store = getUsersStore();
  return (store.users || []).find((u) => u.id === id);
}

export function addUser(input) {
  const store = getUsersStore();
  const now = new Date().toISOString();
  const id = input?.id || `u-${Date.now()}`;
  const user = {
    id,
    name: input.name,
    email: String(input.email || '').toLowerCase(),
    role: input.role || 'user',
    blocked: !!input.blocked,
    phone: String(input.phone || ''),
    address: String(input.address || ''),
    addressStreet: String(input.addressStreet || ''),
    addressNumber: String(input.addressNumber || ''),
    addressNeighborhood: String(input.addressNeighborhood || ''),
    addressCity: String(input.addressCity || ''),
    addressState: String(input.addressState || ''),
    addressComplement: String(input.addressComplement || ''),
    cep: String(input.cep || ''),
    country: String(input.country || ''),
    createdAt: now,
    updatedAt: now,
  };
  // Evita duplicidade de email
  if ((store.users || []).some((u) => u.email === user.email)) {
    const err = new Error('Email já existe');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  store.users.push(user);
  saveUsersStore();
  return user;
}

export function updateUserById(id, patch) {
  const store = getUsersStore();
  const idx = (store.users || []).findIndex((u) => u.id === id);
  if (idx < 0) return null;
  const prev = store.users[idx];
  const nextEmail = typeof patch.email !== 'undefined' ? String(patch.email).toLowerCase() : prev.email;
  // Evita duplicidade de email ao editar
  if (nextEmail !== prev.email && (store.users || []).some((u) => u.email === nextEmail)) {
    const err = new Error('Email já existe');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  const now = new Date().toISOString();
  const next = {
    ...prev,
    ...patch,
    email: nextEmail,
    role: patch.role || prev.role,
    blocked: typeof patch.blocked !== 'undefined' ? !!patch.blocked : prev.blocked,
    phone: typeof patch.phone !== 'undefined' ? String(patch.phone) : prev.phone,
    address: typeof patch.address !== 'undefined' ? String(patch.address) : prev.address,
    addressStreet: typeof patch.addressStreet !== 'undefined' ? String(patch.addressStreet) : prev.addressStreet,
    addressNumber: typeof patch.addressNumber !== 'undefined' ? String(patch.addressNumber) : prev.addressNumber,
    addressNeighborhood: typeof patch.addressNeighborhood !== 'undefined' ? String(patch.addressNeighborhood) : prev.addressNeighborhood,
    addressCity: typeof patch.addressCity !== 'undefined' ? String(patch.addressCity) : prev.addressCity,
    addressState: typeof patch.addressState !== 'undefined' ? String(patch.addressState) : prev.addressState,
    addressComplement: typeof patch.addressComplement !== 'undefined' ? String(patch.addressComplement) : prev.addressComplement,
    cep: typeof patch.cep !== 'undefined' ? String(patch.cep) : prev.cep,
    country: typeof patch.country !== 'undefined' ? String(patch.country) : prev.country,
    updatedAt: now,
  };
  store.users[idx] = next;
  saveUsersStore();
  return next;
}

export function deleteUserById(id) {
  const store = getUsersStore();
  const before = store.users.length;
  store.users = (store.users || []).filter((u) => u.id !== id);
  const removed = store.users.length < before;
  if (removed) saveUsersStore();
  return removed;
}

export default initial;
