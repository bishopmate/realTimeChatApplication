import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages.js';
import './Chat.css';

let socket;
const ENDPOINT = 'https://besties-chat-application.herokuapp.com/';
const Chat = ({ location }) => {
    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
    
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        
        socket.emit('join', { name, room}, () => {
             
        });

        return () => {
            socket.disconnect();
            socket.off();
        }

    }, [ENDPOINT, location.search]);
    // console.log(location);

    useEffect(()=>{
        socket.on('message', ( message ) => {
            setMessages([ ...messages, message ]);
        })
    }, [ messages ]);

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);
    return(
        <div class = "outerContainer">
            <div class = "container">
                <InfoBar room = { room } />
                <Messages messages = {messages} name = {name}/>
                <Input message = { message } setMessage = { setMessage } sendMessage = { sendMessage} />
            </div>
        </div>
    )

}
 
export default Chat;