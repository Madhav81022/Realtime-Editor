import { useState } from 'react';
import toast from 'react-hot-toast';
import {  useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';


const Home = () => {

    const [roomId,setRoomId]= useState('');
    const [username,setUsername]= useState('');
    const navigate = useNavigate();

    
    const createClassRoomId = (e)=>{
        e.preventDefault();
        const id = uuidV4();
        toast.success("Created new Room");
        setRoomId(id);
       
    }

    const handleClick=()=>{
       if(!roomId || !username)
       {
        toast.error("Detail is required");
        return;
       }
        toast.success("Welcome to the Editor")
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            },
        });
       
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-700">
        <div className="bg-gray-600 shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="flex  mb-4">
            <img src="/code-sync.png" alt="code-sync-logo" className="h-14 w-48" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Join a Room</h3>
          <p className="text-gray-800 mb-6">Paste invitation ROOM ID to join</p>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room ID"
              value={roomId}
              onChange={(e)=>setRoomId(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition" onClick={handleClick}>Join</button>
            <p className="text-center text-gray-800">
              If you don't have an invite, create a &nbsp;
              <a onClick={createClassRoomId} href="#" className="text-blue-500 underline hover:text-blue-600 ">new room</a>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;
  