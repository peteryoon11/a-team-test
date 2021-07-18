var express = require('express')
var router = express.Router()

const storeService = require('../services/store-services');


router.get('/list' , storeService.getList);
router.get('/list/:name' , storeService.getListByName);
router.get('/list/postcode/:postcode' , storeService.getLatitudeLongitudeByPostcode);
router.post('/list/postcodes' , storeService.getLatitudeLongitudeByPostcodes);

router.post('/list/radius/scope' , storeService.getPostcodeList);

module.exports = router