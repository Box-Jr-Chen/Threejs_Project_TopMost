const express = require('express');
const router = express.Router();

const con_warehouse = require('../controllers/controller_warehouse');

router.get('/',async (req,res)=>{
    await con_warehouse.list(req,res) ;
 });
 
 router.post('/',async (req,res)=>{
    await con_warehouse.add(req,res) ;
 });
 
 router.patch('/',async (req,res)=>{
    await con_warehouse.update(req,res) ;
 });
 
 router.delete('/',async (req,res)=>{
    await con_warehouse.deleted(req,res) ;
 });
 
 module.exports = router;