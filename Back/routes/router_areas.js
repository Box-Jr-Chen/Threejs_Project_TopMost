const express = require('express');
const router = express.Router();

const con_areas = require('../controllers/controller_areas');

 router.get('/',async (req,res)=>{
    if(req.query.id === undefined||req.query.id === ""){
        return res.status(404).send({"error":"id is wrong"})
    }
    else{
        await con_areas.list(req,res) ;
    }
 });

 router.get('/posinit',async (req,res)=>{
       await con_areas.getPosInit(req,res) ;
});

 router.post('/',async (req,res)=>{
    await con_areas.add(req,res) ;
 });
 
 router.patch('/',async (req,res)=>{
    await con_areas.update(req,res) ;
 });
 
 router.delete('/',async (req,res)=>{
    await con_areas.deleted(req,res) ;
 });
 
 module.exports = router;