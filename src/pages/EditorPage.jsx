import { useEffect, useRef, useState } from "react";
import Client from "../components/Client.jsx";
import Editor from "../components/Editor.jsx";
import { initSocket } from "../socket";
import ACTIONS from "../Action";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";

const EditorPage = () => {
   const codeRef = useRef(null);
   const socketRef = useRef(null);
   const location = useLocation();
   const reactNavigator = useNavigate();
   const { roomId } = useParams();
   const [clients, setClients] = useState([]);
   const [isSidebarOpen, setSidebarOpen] = useState(false);

   useEffect(() => {
      const init = async () => {
         socketRef.current = await initSocket();
         socketRef.current.on('connect_error', (err) => handleErrors(err));
         socketRef.current.on('connect_failed', (err) => handleErrors(err));

         const handleErrors = (e) => {
            console.log('socket error', e);
            toast.error('Socket connection failed, try again later');
            reactNavigator('/');
         };

         socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username,
         });

         // Listening for joined event
         socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
               toast.success(`${username} joined the room.`);
               console.log(`${username} joined`);
            }
            setClients(clients);

            socketRef.current.emit(ACTIONS.SYNC_CODE, {
               code: codeRef.current,
               socketId,
            });
         });

         // Listening for disconnected users
         socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) => prev.filter((client) => client.socketId !== socketId));
         });
      };
      init();

      return () => {
         socketRef.current.disconnect();
         socketRef.current.off(ACTIONS.JOINED);
         socketRef.current.off(ACTIONS.DISCONNECTED);
      };
   }, []);

   const copyRoomId = async () => {
      try {
         await navigator.clipboard.writeText(roomId);
         toast.success('Room ID has been copied to your clipboard');
      } catch (error) {
         toast.error('Could not copy the Room ID');
         console.log(error);
      }
   };

   const leaveRoom = () => {
      reactNavigator('/');
   };

   if (!location.state) {
      return <Navigate to="/" />;
   }

   return (
      <div className="flex h-screen bg-gray-100">
         {/* Mobile Menu Button */}
         <button
            className="absolute top-2 left-2 z-50 md:hidden text-white bg-gray-900 p-2 mb-2 rounded"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
         >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
         </button>

         {/* Sidebar */}
        <div
            className={`fixed inset-y-0 left-0 z-40 w-3/4 max-w-xs bg-gray-900 text-white p-4 flex flex-col h-screen transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4`}
            >
            {/* Logo */}
            <div className="mb-4">
                <img className="w-28" src="/code-sync.png" alt="logo" />
            </div>

            {/* Line Separator */}
            <div className="w-full border-t border-gray-500 my-2"></div>

            {/* Connected Users (Scrollable) */}
            <h3 className="text-lg font-semibold mb-2">Connected Users</h3>
            <div className="w-full flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-600">
                {clients.map((client) => (
                    <Client key={client.socketId} username={client.username} />
                ))}
            </div>

            {/* Buttons - Stays at the Bottom */}
            <div className="mt-auto w-full">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-3 transition" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition" onClick={leaveRoom}>
                    Leave Room
                </button>
            </div>
         </div>

         {/* Main Editor Section */}
         <div className="flex-1 flex flex-col bg-white shadow-lg">
            <Editor
               socketRef={socketRef}
               roomId={roomId}
               onCodeChange={(code) => {
                  codeRef.current = code;
               }}
               
            />
         </div>
      </div>
   );
};

export default EditorPage;
