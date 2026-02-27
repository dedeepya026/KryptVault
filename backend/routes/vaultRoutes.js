const express = require('express');
const router = express.Router();
const vaultController = require('../controllers/vaultController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all vault routes

router.get('/', vaultController.getVaultItems);
router.post('/', vaultController.addVaultItem);
router.put('/:id', vaultController.updateVaultItem);
router.delete('/:id', vaultController.deleteVaultItem);

module.exports = router;
