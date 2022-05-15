const admin_routes = require("./routes/admin_routes");
const employee_routes = require("./routes/employee_routes");
const candidate_routes = require("./routes/candidate_routes");
const employer_routes = require("./routes/employer_routes.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cloudinary = require('cloudinary');
const http = require('http');
const config = require('config');
const {Server} = require('socket.io');

// Confirming that Environment variables are set
if (!config.get('jwtPrivateKey') || !config.get('smtpUsername') || !config.get('smtpPassword') || !config.get('dbPassword') || !config.get('cloudinary_cloud_name') || !config.get('cloudinary_api_key') || !config.get('cloudinary_api_secret')) {
    console.log('FATAL ERROR: Environment variables are not defined');
    process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }
});

cloudinary.config({
    cloud_name: 'meetkalani',
    api_key: '614945554319442',
    api_secret: "u_nX1qZs6QQzC9Uq5Kc4OS6JI-4"
});

app.use(express.json());
app.use('/admin',admin_routes);
app.use('/employee',employee_routes);
app.use('/candidate',candidate_routes);
app.use('/employer',employer_routes);

io.on('connection',socket => {
    console.log('User Connected: '+socket.id);;

    socket.on('join_room',(data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('send_message',(data)=>{
        console.log(data)
        socket.to(data.room).emit("receive_message",data);
    })

    socket.on('disconnect',()=>{
        console.log('User Disconnected...')
    })
})

server.listen(PORT,()=>{
    console.log(`Server has started at port: ${PORT}`);
})