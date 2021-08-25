const express = require('express');
const router = express.Router();

const con_setting_pallet = require('../controllers/controller_setting_pallet');

 router.get('/',async (req,res)=>{
    await con_setting_pallet.list(req,res) ;
 });

 router.post('/',async (req,res)=>{
    await con_setting_pallet.add(req,res) ;
 });
 
 router.patch('/',async (req,res)=>{
    await con_setting_pallet.update(req,res) ;
 });
 
 router.delete('/',async (req,res)=>{
    await con_setting_pallet.deleted(req,res) ;
 });
 
 module.exports = router;