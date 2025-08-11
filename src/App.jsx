import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <Navbar />
      <div className=' flex  '>
        <Sidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        <Chatbox selectedUser={selectedUser} />
      </div>
    </>
  )
}

export default App
