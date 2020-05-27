import React, { useState } from 'react';
import { createRoom,joinRoom  } from '../services/auth';
import { toast } from 'react-toastify';
const queryString = require('query-string');



const Join = (props) => {
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [roomKey,setRoomKey] = useState('');


    const parsed = queryString.parse(props.location.search);

    async function validate(){
        if(name && roomKey && room){
            const data = await joinRoom(name,room,roomKey);
            if(data){
                props.history.push('/chat');
            }else{
                toast.error('Wrong Room ID or Key');
            }
        }
    }

    async function newRoom(){
        if(name){
            const data = await createRoom(name);
            if(data){
                props.history.push('/chat');
            }
        }
        return false;
    }



    return (
        
        <div className="" style={{ backgroundImage:"url('/bg.jpg')", backgroundRepeat:"none",backgroundSize:"cover" }}>
            <div style={{width:"100%",height:"100vh",backgroundColor:"rgba(0,0,0,0.7)"}}>
                <div className="d-none d-md-block"><div className="py-5"></div></div>
                <div className="topText pt-5">Welcome to ChatRoom</div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="box">
                                <div>
                                    <div className="heading">
                                        <div style={{display:"inline-block"}}>Join
                                            <div className="bottom-bar"></div>
                                        </div>
                                    </div>
                                    <div><input type="text" placeholder="Name" className="input" onChange={(e)=> setName(e.target.value) } /></div>
                                    <div><input type="text" placeholder="Room ID" className="input" value={parsed.id}  onChange={(e)=> setRoom(e.target.value) } /></div>
                                    <div><input type="text" placeholder="Room Key" className="input" value={parsed.key} onChange={(e)=> setRoomKey(e.target.value) } /></div>
                                    <div onClick={() => validate() } className="input btn1">Join Room</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-block d-md-none"><div className="pt-5"></div></div>
                            <div className="box">
                                <div>
                                    <div className="heading">
                                        <div style={{display:"inline-block"}}>Create
                                            <div className="bottom-bar"></div>
                                        </div>
                                    </div>
                                    <div className="mb-2"><input type="text" placeholder="Name" className="input" onChange={(e)=> setName(e.target.value) } /></div>
                                    <div onClick={() => newRoom() } className="input btn1" >Create Room</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Join;