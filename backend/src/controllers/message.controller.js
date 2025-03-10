import cloudinary from "../lib/cloudinary.config.js"
import Message from "../model/mesage.model.js"
import User from "../model/user.model.js"

export const getUsersForSidebar =async(req,res)=>{
    try {
        const logedUserId= req.user._id
        const filteredUsers= await User.find({_id:{$ne:logedUserId}}).select("-password")

        res.status(201).json({
            success:true,
            allUsers:filteredUsers
        })
    } catch (error) {
        console.log("eeeror occured i all users",error);
        
        res.status(500).json({
            success:false,
           message:"internal erver error"
        })
        
    }

}

// getting all message between two users
export const getMessages=async (req,res)=>{
    try {
        const senderId=req.user._id
        const receverId=req.params.id
        const allMessages=await Message.find({
            $or:[
                {senderId:senderId,receverId:receverId},
                {senderId:receverId,receverId:senderId},

        ]

        })

        res.status(500).json({
            success:true,
          allmessagesBetweenThem:allMessages
        })
      
    } catch (error) {
        res.status(500).json({
            success:false,
           message:"internal erver error"
        })
        
    }

}

export const sendMessage=async (req,res)=>{
    try {
        const {image,text}=req.body
const receverId=req.params.id
const senderId=receverId.user._id
let imageUrl 
if(image){
    const imageUploadResponse =await cloudinary.uploader.upload(image)
   imageUrl=imageUploadResponse.secure_url}


   const newMessage= new Message({
    senderId:senderId,
    receverId:receverId,
    image:imageUrl,
    text:text
   })

   res.status(500).json({
    success:true,
  newMessage
})

   await newMessage.save()
    } catch (error) {

        
    
      

        res.status(500).json({
            success:false,
           message:"internal erver error"
        })
        
    
        
    }
}