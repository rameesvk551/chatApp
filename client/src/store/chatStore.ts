import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
interface User {
    _id: string | null
    fullName: string;
    email: string;
    profilePic:string
  }
interface ChatState{
    messages:[]
users:[]
selectedUser:User | null
isLoading:boolean
isMessagesLoading:boolean,
isUsersLoading:boolean
getUsers:()=>Promise<void>
getMessages:(userId:string)=>Promise<void>
setSelectedUser: (selectedUser: User | null) => Promise<void>;



}

export const chatStore=create<ChatState>((set)=>({
messages:[],
users:[],
selectedUser:null,
isLoading:false,
isUsersLoading:false,
isMessagesLoading:false,


getUsers:async()=>{
    set({isUsersLoading:true})
    try {
        console.log("allllllllllll users");
        
     const res= await  axiosInstance.get("/messages/users")
     
        set({users:res.data.users})
        console.log("rrrrrrrrrrrrespone",res);
        
    } catch (error) {
        console.log("error in getall users",error);
        
        const err= error as any
        toast.error(err.data.response.message)
        
    }finally{
        set({isUsersLoading:false})
    }

},
getMessages:async(userId)=>{
    try {
        set({isMessagesLoading:true})
        const res=await axiosInstance.get(`/messages/${userId}`)
        set({messages:res.data.messages})
    } catch (error) {
        console.log("error in getall messages",error);
        const err= error as any
        toast.error(err.data.response.message)
        
    }finally{
        set({isMessagesLoading:false})
    }
 

},
setSelectedUser:async (selectedUser)=> set({selectedUser})
}))