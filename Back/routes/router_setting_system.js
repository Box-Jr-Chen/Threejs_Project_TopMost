const express = require('express');
const router = express.Router();

const con_setting_system = require('../controllers/controller_setting_system');


router.get('/interval',async (req,res)=>{
       await con_setting_system.FindInterval(req,res) ;
});

router.get('/sortamount',async (req,res)=>{
       await con_setting_system.FindSortAmount(req,res) ;
});
module.exports = router;