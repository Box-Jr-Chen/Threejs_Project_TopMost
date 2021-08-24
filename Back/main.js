const express = require('express');
var   cors = require('cors');
const app =express();
const port = 3000;
const bp = require('body-parser')
const routerwarehouse = require('./routes/router_warehouse');
const routerarea = require('./routes/router_areas');
const router_setting_area_interval = require('./routes/router_setting_area_interval');

app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use('/warehouse',async (req,res)=>{
    await routerwarehouse(req,res) ;
 });
 app.use('/area',async (req,res)=>{
    await routerarea(req,res) ;
 });

 app.use('/interval',async (req,res)=>{
    await router_setting_area_interval(req,res) ;
 });

app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
});