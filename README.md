# 🔐 KryptVault – Zero-Knowledge Password Manager

KryptVault is a **secure, full-stack zero-knowledge password manager** that encrypts sensitive data locally in the browser before storing it in the cloud. The server never sees plaintext credentials, ensuring complete user privacy and security.
> KryptVault follows a strict zero-knowledge model. If the master password is lost, the data cannot be recovered since it is never stored on the server.
---

## 🚀 Features

* 🔒 **Zero-Knowledge Storage** – All passwords are encrypted client-side.
* 🔑 **PBKDF2 Key Derivation** – Converts the master password into a strong cryptographic key using a unique salt.
* 🔐 **AES-256 Encryption** – Industry-standard encryption for vault items.
* ⚡ **Secure Authentication** – JWT-based login with hashed passwords.
* 🎨 **Modern UI** – Dark themed responsive dashboard.
* 🔎 **Search & Management** – Instantly search, reveal, and copy credentials.
* 🧰 **Password Generator** – High-entropy secure password creation.
* 🛡️ **Security Middleware** – Rate limiting, Helmet, and CORS protection.

---

## 🏗️ Architecture

### Backend

* Node.js, Express, MongoDB Atlas
* JWT authentication and secure API
* Encrypted vault storage

### Frontend

* React (Vite)
* Client-side encryption using Crypto-JS
* Secure session and key management

---

## 🛠️ Tech Stack

**Frontend:** React, Axios, Crypto-JS
**Backend:** Node.js, Express, MongoDB, JWT, Bcrypt
**Security:** Helmet, CORS, Express-Rate-Limit
**Database:** MongoDB Atlas

---

## 📷 Application Preview

user vault

<img width="1459" height="795" alt="vault of userr" src="https://github.com/user-attachments/assets/128be7cd-e468-4563-9444-18599b2536f3" />

login page

<img width="1459" height="795" alt="login page" src="https://github.com/user-attachments/assets/1b965c75-3ff2-447d-b8ee-171beccdb13a" />


