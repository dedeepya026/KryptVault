const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    siteName: {
        type: String,
        required: true
    },
    identifier: {
        type: String, // Encrypted username/email for the site
        required: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    iv: {
        type: String, // Initialization vector for AES
        required: true
    },
    tag: {
        type: String // Optional: for GCM mode
    }
}, { timestamps: true });

module.exports = mongoose.model('VaultItem', vaultItemSchema);
