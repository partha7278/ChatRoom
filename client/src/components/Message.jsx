import React from 'react';
import ReactEmoji from 'react-emoji';


const Message = ({ message, name  }) =>{


    if(name.trim().toLowerCase() === message.user.trim().toLowerCase()){
        return(
            <div className="mr-2">
                <div className="d-flex justify-content-end">
                    <div className="sender_msg my-1">
                        {ReactEmoji.emojify(message.text)}
                    </div>
                </div>
            </div>
        );

    }else if(message.user.trim().toLowerCase() === 'admin'){
        return (
            <div className="d-flex justify-content-center">
                <p className="admin_msg">{ReactEmoji.emojify(message.text)}</p>
            </div>
        );
    }else{
        return (
            <div className="ml-2">
                <div className="d-flex justify-content-start">
                    <div className="receiver_msg my-1">
                        <b className="user_name">{message.user}</b>
                        <p className="mb-1">{ReactEmoji.emojify(message.text)}</p>
                    </div>
                </div>
            </div>
        );
    }

    
}

export default Message;