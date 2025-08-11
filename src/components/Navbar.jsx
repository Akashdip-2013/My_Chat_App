import React from 'react'

const Navbar = () => {
  return (
    <div className='  w-[100vw] text-center bg-violet-800 text-white font-extrabold text-4xl p-[5px] fixed justify-center items-center z-10 border-b border-violet-700 '>
      <div className='logo flex justify-center items-center gap-3 '>
        <img src="/meetme.png" alt="" className=' h-[50px] justify-center items-center shadow-[5px_5px_5px_black] rounded-[50%] ' />

        <h1 className=' italic flex justify-center items-center text-shadow-[5px_5px_5px_black] '>iCHAT</h1>
      </div>
    </div>
  )
}

export default Navbar