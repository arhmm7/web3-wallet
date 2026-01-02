import React from 'react'
import { IoMdAdd } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

function PhraseFrom({value,setValue,setShowForm}) {

  return (
    <div className='z-1 fixed w-full h-screen bg-zinc-800 flex flex-col justify-center gap-5 items-center'>
      <div className='bg-lime-300 text-black p-3 rounded-full absolute top-5 right-5' onClick={()=>setShowForm(false)}><IoClose/></div>
      <h1 className='text-2xl font-semibold'>Enter Recovery Phrase</h1>
      <textarea className='bg-zinc-900 p-4 w-[90%] h-[30%] md:w-[50%] md:h-[30%] rounded-xl flex items-start justify-start' type='textarea' value={value} onChange={(e) => setValue(e.target.value)}></textarea>
      <button className="bg-lime-300  w-[90%]  md:w-[50%]  justify-center text-black  rounded-xl p-2 px-10 flex gap-2 items-center" onClick={()=>setShowForm(false)}>

          <IoMdAdd/> Add Wallet
      </button>
    </div>
  )
}

export default PhraseFrom