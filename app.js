const connectToMongo = require('./db');
const express = require('express');

// Coneection
const app = express();
const env = process.env;
const port = env.PORT;
connectToMongo();

app.get('/',(req,res)=>{
    res.send("Hello World!");
})

// Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
})