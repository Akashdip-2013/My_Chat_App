import React, { useState, useEffect, useRef } from 'react'
import { socket } from './Sidebar'

const Chatbox = ({ selectedUser }) => {

  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState({}); 
  const messagesRef = useRef(null);

  useEffect(() => {
    socket.on('private-message', ({ from, senderName, message }) => {
      setConversations(prev => ({
        ...prev,
        [from]: [
          ...(prev[from] || []),
          { from: senderName, text: message }
        ]
      }));
    });

    return () => {
      socket.off('private-message');
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const container = messagesRef.current;
    // wait until browser paints updated DOM, then scroll
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [
    selectedUser?.id,
    // only depend on the length of this user's messages so other users' updates don't re-trigger
    (conversations[selectedUser?.id] || []).length
  ]);

  function handlesubmit(e) {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const audio = new Audio("../../notification.mp3");
    audio.play();

    // Add message to selected user's conversation
    setConversations(prev => ({
      ...prev,
      [selectedUser.id]: [
        ...(prev[selectedUser.id] || []),
        { from: "Me", text: message }
      ]
    }));

    // Send to server
    socket.emit('private-message', {
      to: selectedUser.id,
      message
    });

    setMessage("");
  }

  if (!selectedUser) {
    return (
      <div className="chatbox w-[65%] h-[calc(100vh)] flex flex-col items-center justify-center text-white bg-[#290d6a] text-2xl text-center ">
        <img src="../../message.png" alt="" className=' w-[10rem] h-[10rem]  ' />
        Select a user to start chatting...
      </div>
    );
  }

  return (

    <div className=' chatbox bg-violet-400 h-[calc(100vh-50px)] w-[65%] flex flex-col items-baseline bg-[url(/whatsappbackground.jpg)] relative top-[50px] border-l border-violet-700 '>

      <div className='bg-[#222] text-white p-2 text-2xl font-extrabold w-full border-b border-violet-700 text-center italic '>
        {selectedUser.name}
      </div>

      <div ref={messagesRef} className=' messages h-[calc(100%-48px-52px)] text-white z-0 overflow-auto px-[10px] scrollbar-hidden w-[100%] '>

        {(conversations[selectedUser.id] || []).map((msg, index) => (
          <div
            key={index}
            className={`p-2 w-[75%] m-2 flex flex-wrap whitespace-pre-wrap break-words selection:bg-black  ${msg.from === "Me" ? "bg-violet-700 float-right rounded-[10px_0px_10px_10px]" : "bg-blue-600 float-left rounded-[0px_10px_10px_10px]"
              }`}
          >
            {msg.text}
          </div>
        ))}

        {/* <div ref={messagesEndRef} /> */}

      </div>

      <div className=' z-10 absolute bottom-2 w-[100%] '>

        <form onSubmit={handlesubmit} className=' h-[2rem] flex justify-center items-center gap-1 '>

          <input placeholder={`Message ${selectedUser.name}`} type="text" value={message} onChange={(e) => setMessage(e.target.value)} className=' bg-[#1f1f1f] flex-3/4 p-2 rounded-3xl px-5 text-gray-100 m-1 ' />

          <button type='submit' className=' bg-violet-700 text-white font-extrabold flex justify-center items-center min-h-fit min-w-fit p-[10px_12px_10px_10px] rounded-[50%] cursor-pointer border-1 m-1 '>

            <img src="/send.png" alt="" className=' h-[20px] w-[20px] min-h-fit min-w-fit invert ' />

          </button>

        </form>
      </div>
    </div>
  )
}

export default Chatbox
