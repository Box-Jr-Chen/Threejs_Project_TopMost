const express = require('express');
const router = express.Router();

const con_algs = require('../controllers/controller_algs');




 router.post('/sorting-project',async (req,res)=>{
    await con_algs.Sorting_prject(req,res) ;
 });
 
 router.post('/sorting-project/single3',async (req,res)=>{
   await con_algs.Sorting_prject_singlefirst(req,res) ;
   //await con_algs.Sorting_prject(req,res) ;
});



 module.exports = router;