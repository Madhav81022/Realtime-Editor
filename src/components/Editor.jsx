import { useEffect, useRef ,useState} from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Action";

const Editor = ({socketRef,roomId,onCodeChange }) => {
  const editorRef = useRef(null);
 // const [topMargin, setTopMargin] = useState("mt-0");

  useEffect(() => {
    if (editorRef.current) return; // Prevent multiple initializations

    const textarea = document.getElementById("realtimeEditor");
    if (!textarea) return;

    editorRef.current = Codemirror.fromTextArea(textarea, {
      mode: { name: "javascript", json: true },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

  

    editorRef.current.on('change',(instance, changes) => {
       // console.log('changes',changes);
        const {origin} = changes;
        const code= instance.getValue();

        onCodeChange(code);

        if(origin !== 'setValue')
        {
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                roomId,
                code,
            });
        }

    });

    

    // Set default text
    editorRef.current.setValue("//You can code here...\n");

    // Make editor take full height
    editorRef.current.setSize("100%", "100%");
  }, []);

  useEffect(()=>{
    if(socketRef.current)
    {
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            if(code !== null)
            {
                editorRef.current.setValue(code);
            }
        });
    }

    return ()=>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
   
  },[socketRef.current])

//    // Adjust top margin when sidebar is collapsed
//    useEffect(() => {
//     setTopMargin(isSidebarOpen ? "mt-0" : "mt-14");
//   }, [isSidebarOpen]);

  return (
    <div className="w-full h-screen bg-gray-900 mt-14 md:mt-0">
    <div className="w-full h-full bg-gray-900"> {/* Ensures full dark background */}
      <textarea id="realtimeEditor"></textarea>
    </div>
  </div>
  );
};

export default Editor;