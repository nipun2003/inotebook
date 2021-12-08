const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.json(
         {
             "help" : "notes endpoint"
         }
    );
})

module.exports = router;