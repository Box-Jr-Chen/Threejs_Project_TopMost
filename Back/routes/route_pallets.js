const express = require('express');
const router = express.Router();

const con_pallet = require('../controllers/controller_pallet');


router.get('/',async (req,res)=>{
       await con_pallet.list(req,res) ;
});

router.get('/exit',async (req,res)=>{
   await con_pallet.list_Exit(req,res) ;
});

router.get('/exit_count',async (req,res)=>{
   await con_pallet.list_ExitExeCount(req,res) ;
});

router.post('/',async (req,res)=>{
   await con_pallet.add(req,res) ;
});

router.patch('/',async (req,res)=>{
   await con_pallet.update(req,res) ;
});

router.patch('/muli',async (req,res)=>{
   await con_pallet.update_Area_Muliti(req,res) ;
});

router.delete('/',async (req,res)=>{
   await con_pallet.deleted(req,res) ;
});

 
 module.exports = router;