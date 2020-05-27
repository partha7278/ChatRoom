const socketio = require('socket.io');
const { add_user, get_user } = require('../startup/model');


module.exports = async function(server){

    const io = socketio(server);

    io.on('connection',async (socket)=>{
        console.log('A new Connection');

        socket.on('join',async ({user},callback)=> {
        
            let new_name = await add_user(user,socket);
            if(new_name){
                callback(new_name);
                user.name = new_name;
            }

            socket.emit('message',{user:'admin',text:`${user.name}, welcome to the Room ${user.room}`});
            socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name}, has joined!`});

            socket.join(user.room);

            callback();
        });


        socket.on('sendMessage',(user,message,callback) =>{

            io.to(user.room).emit('message',{user:user.name, text:message});

            callback();
        });

        socket.on('typing', (data)=> {
            io.to(data.room).emit('display', data)
        });


        socket.on('disconnect', async ()=>{

            let user = await get_user(socket);

            if(user){
                socket.broadcast.to(user.roomID).emit('message',{user:'admin',text:`${user.users[0].name}, has left!`});
            }else{
                console.log('unknow left');
            }

            console.log('User left');
        });
    });
}