import { useState } from 'react'
import Navbar from './components/Navbar'
import { Routes ,Route, Navigate} from 'react-router'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import SettingsPage from './components/SettingsPage'
import ProfilePage from './components/ProfilePage'
import SignUpPage from './components/SignUpPage'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore'


function App() {
  
  const {authUser , checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

 
  if(isCheckingAuth && !authUser){
    return ( <div className='flex items-center justify-center h-screen' data-theme="coffee">
      <Loader className='size-10 animate-spin'/>
    </div>)
  }
  return (
   <div data-theme ="coffee">
    <Navbar />

    <Routes>
      <Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />}  />
      <Route path='/signup' element={!authUser ? <SignUpPage/>: <Navigate to ={"/"} />} />
      <Route path="/login" element ={!authUser ? <LoginPage /> : <Navigate to ={"/"} />} />
      <Route path="/settings" element ={<SettingsPage />} />
      <Route path="/profile" element ={authUser ? <ProfilePage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster />
   </div>
  )
}

export default App
