import React,{ useEffect,useState } from 'react';
import { serverUrl } from '../config.json';
import { joinexRoom,setKey } from '../services/auth';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import Messages from './Messages';


let socket;
let user_details;
let timeout;

const Chat = (props) => {

    const [user,setUser] = useState({});
    const [message, setMessage] = useState('');
    const [allmessages, setallMessages] = useState([]);
    const [typing,setTyping] = useState('');
    const endPoint = serverUrl;



    useEffect(() => {
        (async () => {
            const join_data = await joinexRoom();
            if(!join_data){
                props.history.push('/');
            }
            user_details = join_data;
            setUser(join_data);

        })();

        return () => {
            user_details=null;
            setUser(null);
        }
    },[props.history]);



    
    useEffect(() => {

        if(user.key){
            socket = io(endPoint);
            socket.emit('join',{user},(new_name) => {

                if(new_name){
                    user_details.name = new_name;
                    setKey('name',new_name);
                }
                
            });

            socket.on('message',(message) => {
                setallMessages(allmessages => [...allmessages,message]);
            });
        }

        return () => {

            if(socket){
                socket.emit('disconnect');
                socket.off();
                socket=null;
            }
        }
    },[user]);




    useEffect(()=> {
        if(socket){
            socket.on('display', (data)=>{
                if(data.typing === true && data.user !== user_details.name){
                    setTyping(`${data.user} typing...`);
                }else{
                    setTyping('');
                }
            });
        }
        return () => {
            setTyping(null);
        }
    },[user]);



    const sendMessage = (event) => {
        event.preventDefault();

        if(message && socket){
            socket.emit('sendMessage',user_details, message,()=> setMessage(''));
            clearTimeout(timeout);
            typingTimeout();
        }
    }


    const copyDone = () => {
        toast.success('Link Copied!');
    }

    const typingTimeout = () => {
        clearTimeout(timeout);
        socket.emit('typing',{user:user_details.name, room:user_details.room, typing:false});
    }


    const typingUpdate = (e) => {
        if(e.key !== 'Enter'){
            socket.emit('typing',{user:user_details.name, room:user_details.room, typing:true});
            clearTimeout(timeout);
            timeout = setTimeout(typingTimeout, 1000);
        }else{
            clearTimeout(timeout);
            typingTimeout();
        }
    }




    return (
        user_details ? (
        <div className="chat-body">
            <div className="container">
                <div className="d-none d-md-block"><div className="py-4"></div></div>
                
                <div className="row pt-2">
                    <div className="col-md-7 mx-auto">
                        <div className="chat-box">
                            <div className="top-box d-flex justify-content-between">

                                <div className="ml-2">
                                    <span className="roomid-box">{user.room}</span>
                                    <span className="ml-4">{typing}</span>
                                </div>
                                <div className="mr-5">
                                    <CopyToClipboard onCopy={()=> copyDone() } text={`http://localhost:3000/?id=${user.room}&key=${user.key}`}>
                                        <img src="/link.svg" alt="link icon" width="25px" style={{cursor:'pointer'}} />
                                    </CopyToClipboard>
                                </div>

                            </div>
                            <div className="">
                                <Messages messages={allmessages} name={user_details.name} />
                            </div>
                            <div className="d-flex w-100 pb-2 pt-3">
                                <div className="w-100 mr-4 ml-3">
                                    <input value={message} onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e)=> e.key === 'Enter' ? sendMessage(e) : typingUpdate(e) } placeholder="Type a message..." type="text" className="input-msg mb-1" />
                                </div>
                                <div className="mr-4"><img src="/send.svg" alt="send icon" width="40px" onClick={(e)=> sendMessage(e) } style={{cursor:'pointer'}} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> ) :
        (<div>Loading...</div>)
    )
}

export default Chat;