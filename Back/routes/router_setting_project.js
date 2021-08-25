const express = require('express');
const router = express.Router();

const con_setting_project = require('../controllers/controller_setting_project');

 router.get('/',async (req,res)=>{
    await con_setting_project.list(req,res) ;
 });

 router.post('/',async (req,res)=>{
    await con_setting_project.add(req,res) ;
 });
 
 router.patch('/',async (req,res)=>{
    await con_setting_project.update(req,res) ;
 });
 
 router.delete('/',async (req,res)=>{
    await con_setting_project.deleted(req,res) ;
 });
 
 module.exports = router;