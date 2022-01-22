const admin_routes = require("./routes/admin_routes");
const employee_routes = require("./routes/employee_routes");
const candidate_routes = require("./routes/candidate_routes");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/admin',admin_routes);
app.use('/employee',employee_routes);
app.use('/candidate',candidate_routes);

app.get('/',(req,res)=>{
    res.send('You are getting Response');
})

app.listen(PORT,()=>{
    console.log(`Server has started at port: ${PORT}`);
})