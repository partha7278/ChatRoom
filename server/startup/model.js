const mongoose = require('mongoose');
const joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    pcUnique: {
        type:String,
        required:true
    },
    nameID:{
        type:Number,
        required:true
    },
    socketID :{
        type:String
    },
    joinTime: { type:Date , default: Date.now },

});

const roomShecma = new mongoose.Schema({
    roomID: {
        type : Number,
        minlength: 6,
        maxlength: 6,
        required: true
    },
    roomKey: {
        type: String,
        minlength:4,
        maxlength:4,
        required: true
    },
    users: [userSchema],
    date: { type:Date , default: Date.now }
});

const Room = mongoose.model('room',roomShecma);


async function generateRoomID(){
    let num = Math.floor(10000000 + Math.random() * 90000000);
    const froom = await Room.find({ roomID:num }).limit(1);

    return !froom ? generateRoomID() : num;
}

function generateRoomKey(){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function joinRoom(id,key){
    const room = await Room.find({ roomID:id, roomKey:key }).limit(1);
    return room;
}


async function add_user(user,socket){

    user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);

    const room = await Room.findOne({roomID:user.room, roomKey:user.key});
    if(!room) return;

    for(let x=0;x<room.users.length;x++){
        if(room.users[x].name == user.name && room.users[x].pcUnique == user.token){
            room.users[x].socketID = socket.id;
            room.save();
            return;
        }
        if(room.users[x].name == user.name){
            let nid = room.users[x].nameID +1;
            user.name = user.name + nid;
            room.users[x].nameID = nid;
            room.users.push({ name:user.name, pcUnique:user.token, socketID:socket.id, nameID:nid });
            room.save();
            return user.name;
        }
    }

    room.users.push({ name:user.name, pcUnique:user.token, socketID:socket.id, nameID:0 });
    room.save();

    return;
}



function validate(room){
    const schema = {
        roomId: joi.number().min(10000000).max(99999999).required(),
        roomKey: joi.string().min(4).max(4).required()
    }

    return joi.validate(room,schema);
}



async function get_user(socket){
    const room = await Room.findOne({'users.socketID': socket.id },{roomID:1,'users.socketID.$':1});
    if(!room) return;

    return room;
}




exports.Room = Room;
exports.generateRoomKey = generateRoomKey;
exports.generateRoomID = generateRoomID;
exports.joinRoom = joinRoom;
exports.validate = validate;
exports.add_user = add_user;
exports.get_user = get_user;