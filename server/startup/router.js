const express = require('express');
const router = express.Router();
const { Room,generateRoomKey,generateRoomID,joinRoom,validate } = require('./model');




router.get('/', (req,res)=>{
    req.send('server is runing');
});


router.post('/api/createRoom',async (req,res) => {
    const roomId = await generateRoomID();
    const roomkey = await generateRoomKey();
    
    let room = new Room({ roomID: roomId, roomKey: roomkey });
    const name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    room.users.push({ name: name,pcUnique:req.body.token,nameID:0 });

    try{
        room = await room.save();
        res.send(room);

    }catch(err){
        res.status(400).send(err);
    }

});



router.post('/api/joinRoom', async (req,res) => {

    const { error } = validate(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const room = await joinRoom(req.body.roomId,req.body.roomKey);
    res.send(room.length > 0 ? true : false);
});



module.exports = router;