const express = require('express');
var   cors = require('cors');
const app =express();
const port = 3000;
const bp = require('body-parser')
const routerwarehouse = require('./routes/router_warehouse');

app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use('/warehouse',async (req,res)=>{
    await routerwarehouse(req,res) ;
 });


app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
});