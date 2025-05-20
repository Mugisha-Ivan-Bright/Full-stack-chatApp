import React from 'react'
import { useChatStore } from '../store/useChatStore'
import {X} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import images from '../assets/assets';

const ChatHeader = () => {
   const {selectedUser,setSelectedUser} = useChatStore();
   const {onlineUsers} = useAuthStore()
  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
            {/* Avatar */}

            <div className='avatar'>
                <div className=' relative  size-10 rounded-full relative'>
                    <img src={selectedUser.profilePic || images.avatar} alt={selectedUser.fullName} />
                </div>
               { onlineUsers.includes(selectedUser._id) && (<div className='absolute size-2 bg-success rounded-full bottom-0 right-0  '></div>)}
            </div>
            {/* User info */}
            <div>
                <h3 className='font-medium'>{selectedUser.fullName}</h3>
                <p className='text-sm text-base-content/70'>
                {onlineUsers.includes(selectedUser._id) ? "Online":"Offline"}
                </p>
            </div>
        </div>
        {/* Close button */}
        <button onClick={()=>setSelectedUser(null)}>
            <X />
        </button>
    </div>
    </div>
  )
}

export default ChatHeader
