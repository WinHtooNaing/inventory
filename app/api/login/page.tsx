"use client"
import Login from '@/components/Login'


const LoginPage = () => {
  return (
    <section className='w-full min-h-screen flex justify-center items-center px-6'>
        <div className=''>
        <h1 className="text-center font-bold text-2xl pb-6 ">Inventory Management System</h1>
        
           
              <Login/>
           
        </div>
    </section>
  )
}

export default LoginPage