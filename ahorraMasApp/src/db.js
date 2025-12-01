import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let _db = null;
let _initializing = false;
let _initPromise = null;

const changeListeners = new Set();

function notifyChange() {
  changeListeners.forEach(cb => {
    try { cb(); } catch (e) { console.error('change listener error', e); }
  });
}

export function addChangeListener(cb) {
  changeListeners.add(cb);
  return () => changeListeners.delete(cb);
}

function attachHelpers(db) {
  if (!db) return db;

  if (!db.runAsync) {
    db.runAsync = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        if (typeof db.transaction === 'function') {
          db.transaction(tx => {
            tx.executeSql(sql, params, (_, result) => resolve(result), (_, err) => { reject(err); return false; });
          }, err => reject(err));
        } else {
          reject(new Error('db.transaction is not available'));
        }
      }).then(res => {
        const verb = (sql || '').trim().split(' ')[0].toUpperCase();
        if (['INSERT', 'UPDATE', 'DELETE'].includes(verb)) setTimeout(() => notifyChange(), 10);
        return res;
      });
    };
  }

  if (!db.getAllAsync) {
    db.getAllAsync = async (sql, params = []) => {
      const res = await db.runAsync(sql, params);
      return res && res.rows ? res.rows._array : [];
    };
  }

  if (!db.getFirstAsync) {
    db.getFirstAsync = async (sql, params = []) => {
      const all = await db.getAllAsync(sql, params);
      return all && all.length ? all[0] : null;
    };
  }

  return db;
}

export async function initDB() {
  if (_initializing && _initPromise) return _initPromise;
  if (_db) return _db;

  _initializing = true;
  _initPromise = (async () => {
    try {
      const nativeAvailable = SQLite && typeof SQLite.openDatabase === 'function';

      if (nativeAvailable) {
        _db = SQLite.openDatabase('ahorramas_v1.db');
        attachHelpers(_db);

        await _db.runAsync(`CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          usuario TEXT,
          edad INTEGER,
          correo TEXT UNIQUE,
          telefono TEXT,
          password TEXT
        )`);

        await _db.runAsync(`CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL,
          descripcion TEXT,
          usuario_id INTEGER
        )`);

        await _db.runAsync(`CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL,
          usuario_id INTEGER
        )`);

        _initializing = false;
        return _db;
      }

      // Web / fallback path
      let AsyncStorage = null;
      try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch (e) { AsyncStorage = null; }

      const storageKey = 'ahorramas_v1_mockdata';
      let data = { usuarios: [], transacciones: [], presupuestos: [] };
      let lastIds = { usuarios: 0, transacciones: 0, presupuestos: 0 };

      async function load() {
        if (!AsyncStorage) return;
        const raw = await AsyncStorage.getItem(storageKey);
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          data = parsed.data || data;
          lastIds = parsed.lastIds || lastIds;
        } catch (e) { /* ignore */ }
      }

      async function save() {
        if (!AsyncStorage) return;
        try { await AsyncStorage.setItem(storageKey, JSON.stringify({ data, lastIds })); } catch (e) { /* ignore */ }
      }

      await load();

      const mock = {};

      mock.runAsync = async (sql, params = []) => {
        const s = (sql || '').trim().toUpperCase();
        if (s.startsWith('CREATE') || s.startsWith('ALTER')) return { rowsAffected: 0 };

        // INSERT into usuarios
        if (s.startsWith('INSERT INTO USUARIOS')) {
          const [nombre, usuario, edad, correo, telefono, password] = params;
          const id = ++lastIds.usuarios;
          const row = { id, nombre: nombre || null, usuario: usuario || null, edad: edad || null, correo: correo || null, telefono: telefono || null, password: password || null };
          data.usuarios.unshift(row);
          await save();
          setTimeout(() => notifyChange(), 10);
          return { insertId: id, rowsAffected: 1 };
        }

        if (s.startsWith('INSERT INTO TRANSACCIONES')) {
          const [usuario_id, tipo, categoria, monto, fecha, descripcion] = params;
          const id = ++lastIds.transacciones;
          const row = { id, usuario_id: usuario_id || null, tipo, categoria, monto: Number(monto), fecha, descripcion };
          data.transacciones.unshift(row);
          await save();
          setTimeout(() => notifyChange(), 10);
          return { insertId: id, rowsAffected: 1 };
        }

        if (s.startsWith('INSERT INTO PRESUPUESTOS')) {
          const [categoria, monto, fecha, usuario_id] = params;
          const id = ++lastIds.presupuestos;
          const row = { id, categoria: categoria || null, monto: Number(monto || 0), fecha: fecha || null, usuario_id: usuario_id || null };
          data.presupuestos.unshift(row);
          await save();
          setTimeout(() => notifyChange(), 10);
          return { insertId: id, rowsAffected: 1 };
        }

        if (s.startsWith('DELETE FROM TRANSACCIONES')) {
          const id = params[0];
          const before = data.transacciones.length;
          data.transacciones = data.transacciones.filter(t => t.id !== id);
          await save();
          setTimeout(() => notifyChange(), 10);
          return { rowsAffected: before - data.transacciones.length };
        }

        if (s.startsWith('DELETE FROM PRESUPUESTOS')) {
          const id = params[0];
          const before = data.presupuestos.length;
          data.presupuestos = data.presupuestos.filter(p => p.id !== id);
          await save();
          setTimeout(() => notifyChange(), 10);
          return { rowsAffected: before - data.presupuestos.length };
        }

        if (s.startsWith('UPDATE TRANSACCIONES')) {
          const [tipo, categoria, monto, fecha, descripcion, id] = params;
          let updated = 0;
          data.transacciones = data.transacciones.map(t => {
            if (t.id === id) { updated = 1; return { ...t, tipo, categoria, monto: Number(monto), fecha, descripcion }; }
            return t;
          });
          await save();
          setTimeout(() => notifyChange(), 10);
          return { rowsAffected: updated };
        }

        if (s.startsWith('UPDATE PRESUPUESTOS')) {
          // expecting: SET categoria = ?, monto = ?, fecha = ? WHERE id = ?
          const [categoria, monto, fecha, id] = params;
          let updated = 0;
          data.presupuestos = data.presupuestos.map(p => {
            if (p.id === id) { updated = 1; return { ...p, categoria, monto: Number(monto), fecha }; }
            return p;
          });
          await save();
          setTimeout(() => notifyChange(), 10);
          return { rowsAffected: updated };
        }

        return { rowsAffected: 0 };
      };

      mock.getAllAsync = async (sql, params = []) => {
        const s = (sql || '').toUpperCase();
        // SELECT 1 quick test
        if (s === 'SELECT 1') return [{ '1': 1 }];

        // Usuarios queries
        if (s.includes('FROM USUARIOS')) {
          if (s.includes('WHERE') && s.includes('CORREO')) {
            const correo = params[0];
            return data.usuarios.filter(u => (u.correo || '').toLowerCase() === (correo || '').toLowerCase());
          }
          return data.usuarios.slice();
        }

        if (s.includes('FROM TRANSACCIONES') && s.includes('ORDER BY') && s.includes('USUARIO_ID')) {
          const userId = params[0];
          return data.transacciones.filter(t => t.usuario_id === userId || t.usuario_id === null).sort((a,b)=> (b.fecha||'').localeCompare(a.fecha||''));
        }

        if (s.includes('FROM PRESUPUESTOS')) {
          const userId = params[0];
          return data.presupuestos.filter(p => p.usuario_id === userId || p.usuario_id === null).sort((a,b)=> (b.fecha||'').localeCompare(a.fecha||''));
        }

        if (s.includes('SUM(MONTO) AS TOTAL') && s.includes('GROUP BY CATEGORIA')) {
          const userId = params[0];
          const items = data.transacciones.filter(t => (t.usuario_id === userId || t.usuario_id === null) && t.tipo === 'Gasto');
          const map = {};
          items.forEach(i => { map[i.categoria] = (map[i.categoria] || 0) + Number(i.monto || 0); });
          const arr = Object.keys(map).map(k => ({ categoria: k, total: map[k] }));
          arr.sort((a,b)=> b.total - a.total);
          return arr;
        }

        if (s.includes("COALESCE(SUM(MONTO), 0) AS TOTAL") && s.includes('FECHA LIKE')) {
          const like = params[0] || '';
          const userId = params[1];
          const prefix = like.replace('%','');
          const tipoMatch = s.includes("TIPO = 'INGRESO'") ? 'Ingreso' : 'Gasto';
          const items = data.transacciones.filter(t => (t.usuario_id === userId || t.usuario_id === null) && t.tipo === tipoMatch && (t.fecha||'').startsWith(prefix));
          const total = items.reduce((s,r)=> s + Number(r.monto || 0), 0);
          return [{ total }];
        }

        if (s.includes("STRFTIME('%Y-%m'")) {
          const userId = params[0];
          const now = new Date();
          const months = [];
          for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`); }
          const rows = [];
          months.forEach(mes => { ['Ingreso','Gasto'].forEach(tipo => { const total = data.transacciones.filter(t => (t.usuario_id === userId || t.usuario_id === null) && t.tipo === tipo && (t.fecha||'').startsWith(mes)).reduce((s,r)=> s + Number(r.monto||0), 0); rows.push({ mes, tipo, total }); }); });
          return rows;
        }

        return [];
      };

      mock.getFirstAsync = async (sql, params = []) => {
        const all = await mock.getAllAsync(sql, params);
        return all && all.length ? all[0] : null;
      };

      if (!mock.transaction) {
        mock.transaction = (txCallback, errorCallback, successCallback) => {
          const tx = { executeSql: (sql, params = [], successCb, errorCb) => { mock.runAsync(sql, params).then(res => { if (typeof successCb === 'function') successCb(tx, res); }).catch(err => { if (typeof errorCb === 'function') errorCb(tx, err); }); } };
          try { txCallback(tx); if (typeof successCallback === 'function') successCallback(); } catch (e) { if (typeof errorCallback === 'function') errorCallback(e); }
        };
      }

      attachHelpers(mock);
      _db = mock;
      _initializing = false;
      return _db;
    } catch (error) {
      console.error('Error inicializando DB:', error);
      _initializing = false;
      _initPromise = null;
      _db = null;
      throw error;
    }
  })();

  return _initPromise;
}

export function getDB() { return _db; }
