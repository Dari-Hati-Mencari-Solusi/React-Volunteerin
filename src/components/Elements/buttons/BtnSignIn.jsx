import React from 'react'
import { Link } from 'react-router-dom'

const BtnSignIn = () => {
  return (
    <Link to='/login' className='bg-white text-black font-semibold text-md rounded-[12px] h-[50px] w-full md:w-[189px] text-center flex justify-center items-center'>
      <h1>Masuk</h1>
    </Link>
  )
}

export default BtnSignIn