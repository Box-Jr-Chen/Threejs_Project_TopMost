const express = require('express');
const router = express.Router();
const con_dxf = require('../controllers/controller_dxf');

router.get('/getfiles',async (req,res)=>{
    await con_dxf.GetFileNames(req,res) ;
});
router.get('/getJson',async (req,res)=>{
    await con_dxf.getDxFJson(req,res) ;
});
module.exports = router;