const io = require("socket.io")(8000, {
    cors:{
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        io.emit('existing-users', users);
    })

    // Handle private messages
    socket.on('private-message', ({ to, message }) => {
        if (users[to]) {
            io.to(to).emit('private-message', {
                from: socket.id,
                senderName: users[socket.id],
                message
            });
        }
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('existing-users', users);
    });
    
})

console.log("Socket.IO server running on port 8000");