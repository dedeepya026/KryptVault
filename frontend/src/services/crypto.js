import CryptoJS from 'crypto-js';

/**
 * Derives a key from a master password and salt using PBKDF2.
 * @param {string} password - The master password.
 * @param {string} salt - The salt (stored in user record).
 * @returns {string} - The derived key as a hex string.
 */
export const deriveKey = (password, salt) => {
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 100000
    }).toString();
};

/**
 * Encrypts data using AES-256-GCM (or standard AES in crypto-js).
 * @param {string} data - Plain text to encrypt.
 * @param {string} key - Hex encoded derived key.
 * @returns {object} - { encryptedData, iv }
 */
export const encryptData = (data, key) => {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return {
        encryptedData: encrypted.toString(),
        iv: iv.toString()
    };
};

/**
 * Decrypts data using AES-256.
 * @param {string} encryptedData - The encrypted string.
 * @param {string} key - Hex encoded derived key.
 * @param {string} iv - Hex encoded IV.
 * @returns {string} - Decrypted plain text.
 */
export const decryptData = (encryptedData, key, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(key), {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * Generates a random salt.
 */
export const generateSalt = () => {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
};
