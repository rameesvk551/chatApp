import cloudinary from "../lib/cloudinary.config.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../model/mesage.model.js"
import User from "../model/user.model.js"


export const getUsersForSidebar = async (req,res) => {
  console.log("lllllllfvdvdllloged");
  try {
   
    const loggedUserId = req.user._id;
    
    
    // Fetch all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

    res.status(200).json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error occurred in getUsersForSidebar:", error);

    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || "Something went wrong"}`,
    });
  }
};


// getting all message between two users
export const getMessages=async (req,res)=>{

  console.log("ffffffffffffffeeeeeeeeeeeeeeeeeeeeee");
  
    try {
        const senderId=req.user._id.toString();
        const receverId=req.params.id
        console.log(senderId,receverId,"ffffffffrrijrijgijibj");
        
        const allMessages=await Message.find({
            $or:[
                {senderId:senderId,receverId:receverId},
                {senderId:receverId,receverId:senderId},

        ]

        })
console.log("aaaaaaaaaaaal meages ",allMessages);

        res.status(200).json({
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
const senderId = req.user._id.toString();
let imageUrl =""


if(image){
    const imageUploadResponse =await cloudinary.uploader.upload(image)
   imageUrl=imageUploadResponse.secure_url}


   const newMessage= new Message({
    senderId:senderId,
    receverId:receverId,
    image:imageUrl,
    text:text
   })
  console.log(newMessage)
await newMessage.save()

const receiverSocketId = getReceiverSocketId(receverId);
if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);  
}

   res.status(200).json({
    success:true,
   newMessage
})

    } catch (error) {
console.log("eeror occcccccured",error);

        
    
      

        res.status(500).json({
            success:false,
           message:"internal erver error"
        })
        
    
        
    }
}