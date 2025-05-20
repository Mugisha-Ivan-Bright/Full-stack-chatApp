import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import {io} from  'socket.io-client'
const BASE_URL =import.meta.env.MODE ==="development" ? "http://localhost:5001" :"/";
export const useAuthStore =  create((set,get)=> ({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    signup:async (data) => {
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup" , data);
            set({authUser:res.data});
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {

            toast.error(error.response.data.message)
            console.log(error)
            
        }
        finally{set({isSigningUp:false})}
    },

    logout: async() =>{
        
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disConnectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res =  await axiosInstance.post("/auth/login", data)
             set({authUser:res.data});
             get().connectSocket();
             toast.success(res.message);
            
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        } finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile: async(img) =>{
       set({isUpdatingProfile:true});
       try {
         const res = await axiosInstance.put("/auth/update-profile",img)
         set({authUser:res.data})
         toast.success("Profile updated successfully")
       } catch (error) {
         toast.error(error)
         console.log(error)
       } finally{
        set({isUpdatingProfile:false})
       }
    },
    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data})
            get().connectSocket()

        } catch (error) {

            console.log("Error in checkAuth",error)

            set({authUser:null});

        } finally {

            set({ isCheckingAuth: false});
        }
    },
    connectSocket:()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected)  return;

        const socket = io(BASE_URL , {
            query:{
                userId:authUser._id,
            }
        });

        socket.connect();

        socket.on("getOnLineUsers", (userIds)=>{
            set({onlineUsers:userIds});
        })

        set({socket:socket});
    },
    disConnectSocket:() =>{
        if(get().socket?.connected) get().socket.disconnect();
    },
}
))