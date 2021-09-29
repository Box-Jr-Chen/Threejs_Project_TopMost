const express = require('express');
const router = express.Router();

const con_warehouse = require('../controllers/controller_warehouse');

 router.get('/',async (req,res)=>{
    // console.log(req.query.id);
    if(req.query.id === undefined||req.query.id === ""){
        await con_warehouse.list(req,res) ;
    }
    else
    {
        await con_warehouse.findOne(req,res) ;
    }
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