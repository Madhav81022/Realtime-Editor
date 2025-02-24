import {io} from 'socket.io-client';
//import dotenv from 'dotenv';

//dotenv.config();

export const initSocket = async()=>{

    const options = {
        'force new connection':true,
        reconnectionAttempt:'Infinity',
        timeout:10000,
        transports:['websocket'],
    };
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    // console.log(BACKEND_URL); 
    

    return io(import.meta.env.VITE_BACKEND_URL,options);

}