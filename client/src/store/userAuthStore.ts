import { create } from "zustand";
import {axiosInstance} from '../lib/axios.ts'
import toast from "react-hot-toast";
import {io}from 'socket.io-client'

const BASE_URL=import.meta.env.MODE === "development" 
? "http://localhost:4000/api/" 
: "/"

interface AuthState {
    authState: any;
    isCheckingAuth: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isUpdatingProfile: boolean;
    onlineUsers:string[]
    socket:any
    checkAuth: () => Promise<void>;
    signup: (data:any) => Promise<void>;
    login: (data:any) => Promise<void>;
    updateProfile: (data:any) => Promise<void>;
    logout: () => Promise<void>,
    connectSocket: () => Promise<void>,
    disConnectSocket: () => Promise<void>,
    
    

  }
export const userAuthStore=create<AuthState>((set,get)=>({
    authState:null,
    isCheckingAuth:true,
    isLoggingIn:false,
    isSigningUp:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

    checkAuth:async ()=>{
try {
    const res =await axiosInstance.get("auth/check-auth")
    set({authState:res.data.user})
    get().connectSocket()
} catch (error) {
    console.log("erro occure ",error);

     set({authState:null})
    
}finally{
    set({ isCheckingAuth:false})
}
    },

    signup:async (data:any)=>{
        try {
            set({isSigningUp:true})
        const res=  await  axiosInstance.post("/auth/signup",data)
        toast.success("account created successfuly")
        set({authState:res.data.user})
        get().connectSocket()
        }  catch (error) {
            const err = error as any; 
            toast.error(err.response?.data?.message || "Something went wrong");
        }finally{
            set({isSigningUp:false}) 

        }

    },
    login:async (data:any)=>{
        try {
            set({isLoggingIn:true})
        const res=  await  axiosInstance.post("/auth/login",data)
        toast.success("Logged in succesfully")
        set({authState:res.data.user})
        get().connectSocket()
       
        }  catch (error) {
            const err = error as any; 
            toast.error(err.response?.data?.message || "Something went wrong");
        }finally{
            set({isLoggingIn:false}) 

        }

    },
    logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authState: null });
          get().disConnectSocket()
          toast.success("Logged out successfully");
         
        } catch (error) {
            const err =error as any
          toast.error(err.response.data.message);
        }
      },
      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authState: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          const err =error as any
          toast.error(err.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket:async() =>{
        const {authState}=get()
        if(!authState || get().socket?.connected) return
        const socket=io(BASE_URL,{
          query: { userId: authState._id }
        })
        socket.connect()
        set({socket:socket})
socket.on("getOnlineUsers",(userIds)=>{
set({onlineUsers:userIds})
})
        },
        disConnectSocket:async() =>{
if(get().socket.connected) get().socket.disconnect()
        }
      

}))



export default userAuthStore