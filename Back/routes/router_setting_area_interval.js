const express = require('express');
const router = express.Router();

const con_setting_area_interval = require('../controllers/controller_setting_area_interval');


router.get('/',async (req,res)=>{
       await con_setting_area_interval.FindInterval(req,res) ;
});

module.exports = router;