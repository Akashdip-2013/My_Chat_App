import React, {useState, useEffect} from 'react'
import { io } from 'socket.io-client';
const socket = io('http://localhost:8000'); 

const Sidebar = ({onSelectUser, selectedUser}) => {

  const [names, setNames] = useState(['akash'])
  const [myId, setMyId] = useState('')

  useEffect(()=>{

    const username = prompt('enter your name:');
    socket.emit('new-user-joined', username);
    setMyId(socket.id)

    socket.on('existing-users', users=>{
      if(!users) return;
      const filtered = Object.entries(users)
        .filter(([id]) => id !== socket.id)
        .map(([id, name]) => ({id, name}));
      setNames(prev => {
        const isSame = JSON.stringify(prev) === JSON.stringify(filtered);
        return isSame ? prev : filtered;
      });
    });

    return () => {
      socket.off('existing-users');
    };

  }, []);


  return (
    <div className=' sidebar w-[35%] h-[calc(100vh-50px)] bg-[#000] flex flex-col justify-baseline items-baseline relative top-[50px] overflow-auto '>
      <div className="names flex flex-col gap-2.5 text-white p-[30px_30px_0px_30px] w-[100%] ">
        
        {names
          .filter(user => user && user.name)
          .map((user, index) => (
            <div
              key={user.id || `${user.name}-${index}`}
              onClick={() => onSelectUser(user)}
              className={`sm:flex-row sm:gap-[20px] flex flex-col gap-1 my-[10px] items-center cursor-pointer w-full border-2 border-violet-700 p-3 rounded-2xl 
                ${selectedUser?.id === user.id ? ' scale-105 bg-violet-950  ' : ' border-violet-700'}`}
            >
              <img src="/user.png" alt="" className='w-[40px] h-[40px]  shadow-[0px_0px_15px_bisque] rounded-[50%]  ' />
              {user.name}
            </div>
          ))}

      </div>
    </div>
  )
}

export { socket }
export default Sidebar
