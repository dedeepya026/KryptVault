const VaultItem = require('../models/VaultItem');

exports.getVaultItems = async (req, res) => {
    try {
        const items = await VaultItem.find({ user: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVaultItem = async (req, res) => {
    try {
        const { siteName, identifier, encryptedPassword, iv, tag } = req.body;
        const newItem = await VaultItem.create({
            user: req.user._id,
            siteName,
            identifier,
            encryptedPassword,
            iv,
            tag
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVaultItem = async (req, res) => {
    try {
        const item = await VaultItem.findById(req.params.id);
        if (!item || item.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const { siteName, identifier, encryptedPassword, iv, tag } = req.body;
        item.siteName = siteName || item.siteName;
        item.identifier = identifier || item.identifier;
        item.encryptedPassword = encryptedPassword || item.encryptedPassword;
        item.iv = iv || item.iv;
        item.tag = tag || item.tag;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteVaultItem = async (req, res) => {
    try {
        const item = await VaultItem.findById(req.params.id);
        if (!item || item.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
