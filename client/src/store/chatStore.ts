import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import userAuthStore from "./userAuthStore";
interface User {
    _id: string | null
    fullName: string;
    email: string;
    profilePic:string
  }
interface ChatState{
    messages:any[]
users:[]
selectedUser:any
isLoading:boolean
isMessagesLoading:boolean,
isUsersLoading:boolean
getUsers:()=>Promise<void>
getMessages:(userId:string)=>Promise<void>
sendMessage:(mesageData:any)=>Promise<void>
setSelectedUser: (selectedUser: any) => Promise<void>;
subscribeToMessages:()=>void
unSubscribeToMessages:()=>void



}

export const chatStore=create<ChatState>((set,get)=>({
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
        console.log("rrrrrrrresponse in all mesages",res);
        
        set({messages:res.data.allmessagesBetweenThem})
    } catch (error) {
        console.log("error in getall messages",error);
        const err= error as any
        toast.error(err.data.response.message)
        
    }finally{
        set({isMessagesLoading:false})
    }
 

},
sendMessage:async(mesageData)=> {
const {selectedUser,messages}=get()
try {
  const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`,mesageData)
  console.log("rrrres senddddddd",res);
  set({messages:[...messages,res.data.newMessage]})  
} catch (error) {
    
}
    
},
subscribeToMessages:()=>{
    const {selectedUser} =get()
    if(!selectedUser) return ;

    const socket =userAuthStore.getState().socket

    socket.on("newMessage",(newMessage:any)=>{
    if(    newMessage.senderId !== selectedUser._id) return
        set({messages:[...get().messages,newMessage]})

    })

},
unSubscribeToMessages: () => {
    const socket = userAuthStore.getState().socket;
    if (socket) {
        socket.off("newMessage");  // ✅ Correct method for unsubscribing
    }
}
,
setSelectedUser:async (selectedUser)=> set({selectedUser:selectedUser})
}))