const express = require('express')
const router = express.Router();

const testApi = require('../../../controllers/api/v2/test_api');
router.get('/', testApi.index)

module.exports = router;