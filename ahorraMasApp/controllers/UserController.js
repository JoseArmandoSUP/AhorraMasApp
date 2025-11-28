// src/controllers/UserController.js
import db from '../db';
import SHA256 from 'crypto-js/sha256';

function genSalt() {
  // sal corta: para local está bien; en producción usar salt más robusta y servidor.
  return Math.random().toString(36).substring(2, 12);
}

function hashPassword(password, salt) {
  return SHA256(password + salt).toString();
}

export function createUser({ nombre, email, password }) {
  return new Promise((resolve, reject) => {
    const salt = genSalt();
    const passwordHash = hashPassword(password, salt);

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO users (nombre, email, passwordHash, salt) VALUES (?, ?, ?, ?)`,
        [nombre, email, passwordHash, salt],
        (_, result) => resolve(result),
        (_, err) => {
          console.log('createUser err', err);
          reject(err);
        }
      );
    });
  });
}

export function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email],
        (_, { rows }) => {
          resolve(rows._array[0] || null);
        },
        (_, err) => {
          console.log('getUserByEmail err', err);
          reject(err);
        }
      );
    });
  });
}

export async function verifyUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: 'no_user' };

  const attemptHash = hashPassword(password, user.salt);
  if (attemptHash === user.passwordHash) {
    // omit passwordHash/salt in returned object
    const { passwordHash, salt, recoveryCode, ...safe } = user;
    return { ok: true, user: safe };
  } else {
    return { ok: false, reason: 'bad_password' };
  }
}

export function generateRecoveryCode(email) {
  // 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE users SET recoveryCode = ? WHERE email = ?`,
        [code, email],
        (_, result) => resolve(code),
        (_, err) => {
          console.log('generateRecoveryCode err', err);
          reject(err);
        }
      );
    });
  });
}

export async function verifyRecoveryCodeAndReset(email, code, newPassword) {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: 'no_user' };
  if (!user.recoveryCode || user.recoveryCode !== code) return { ok: false, reason: 'bad_code' };

  const newSalt = genSalt();
  const newHash = hashPassword(newPassword, newSalt);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE users SET passwordHash = ?, salt = ?, recoveryCode = NULL WHERE email = ?`,
        [newHash, newSalt, email],
        (_, result) => resolve({ ok: true }),
        (_, err) => {
          console.log('reset password err', err);
          reject(err);
        }
      );
    });
  });
}
