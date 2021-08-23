const express = require('express');
var   cors = require('cors');
const app =express();
const port = 3000;
// const port = process.env.PORT;
const routerwarehouse = require('./routes/router_warehouse');

app.use(cors());

app.use('/warehouse',async (req,res)=>{
    await routerwarehouse(req,res) ;
 });

 app.get('/test', function (req, res) {
     console.log(req.params);
    res.send(req.params)
  })

app.listen(port,()=>{
    console.log(`App is listening at ${port}`);
});