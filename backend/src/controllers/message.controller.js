import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSideBar= async (req, res)=> {

  try {

    const loggedInUserId = req.user._id;

    const Allusers =await User.find({_id:{$ne:loggedInUserId}}).select("-password");

    res.status(200).json(Allusers);

  } catch (error) {

    console.log("Error occured in getUsersForSideBar router", error.message)
 }
}

export const getMessages = async (req,res)=>{

  try {
    const { id:userToChatId } = req.params;
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or:[
        {senderId:myId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    });
    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in messages router" , error.message);
  }
}

export const sendMessage = async (req,res)=>{

  try {
    const senderId = req.user._id;
    const {text,image} = req.body;
    const {id:receiverId} = req.params;

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image:imageUrl,
    })

    
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);

  } catch (error) {
    res.status(400).json({'message':'Failed to upload image'})
    console.log("Error in sendMessage router")
  }
}