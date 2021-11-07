const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors:{
        origin : '*',
    }
});

io.on('connection', (socket) => {

    socket.on('join', ({ name, room }, callback) => {
            const { error, user } = addUser({ id : socket.id, name, room });
            
            if(error){
                callback(error);
            }

            socket.join();

        }
    )

    socket.on('disconnect', ()=>{
        console.log('User had left');
    })
});

app.use(router); 

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

