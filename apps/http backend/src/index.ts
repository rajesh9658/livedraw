import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import  Jwt  from 'jsonwebtoken';
import {middleware} from './middleware';
import {userschema,roomschema,loginschema} from "@repo/zod-types/types";``
import cors from "cors";
import {prismaClient} from "@repo/db/client"
import {JWT_SECRET} from "@repo/backend-com/config"
import { runInNewContext } from 'vm';
const app = express();
app.use(express.json());
app.use(cors());



//signup logic
app.post('/signup', async (req:Request,res:Response)=>{
    
  const parseddata = userschema.safeParse(req.body);
  if ( !parseddata.success){
    console.log(parseddata.error.message);
    res.json({ message: parseddata.error.message });
    return;
  }

  //TODO: impliment the bcrypt to hash the password before store it in the database
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseddata.data?.email.toString(),
        password: parseddata.data.password,
        name: parseddata.data.name,
        fullname: parseddata.data.fname,
      }
    })
    res.json({
      message: 'user created',
      user:user.id,
    })
   
  } catch (error) {
    res.status(401).json({
      message:"user allrady exists",
      error:error,
    })
  }
  
})

// signin logic

app.post('/signin', async(req,res)=>{
  const parseddata = loginschema.safeParse(req.body);
  if( !parseddata.success){
    console.log(parseddata.error.message);
    res.status(400).json({
      message:parseddata.error.message,
      error:parseddata.error,
    })
    return;
  }
// TODO: check for the hashed password by implimenting the bcryptjs
 
  const user = await prismaClient.user.findFirst({
    where:{
      email:parseddata.data.email,
      password:parseddata.data.password,
    }
  });

  if ( !user){
    res.status(401).json({
      message:"user not found",
      
    })
    return;
  }

  const token = Jwt.sign({
    userId:user?.id

  },JWT_SECRET)
  
  res.json({
    message:"user found",
    token:token,
  })
 
})

//room logic
app.post('/room/create',middleware,async(req:Request,res:Response)=>{
  const parseddata = roomschema.safeParse(req.body);

  if( !parseddata.success){
    res.status(400).json({
      message:parseddata.error.message,
      error:parseddata.error,
    })
    return;
  }
  //@ts-ignore
  const userId = req.userId;
  console.log(userId);
 try {
  const room = await prismaClient.room.create({
    data:{
      name:parseddata.data.name,
      description:parseddata.data.description,
      slug:parseddata.data.slug,
      adminId:userId.toString(),
    }
  })
  res.json({
    message:"room created",
    room:room.id,
  })
  
 } catch (error) {
  res.status(409).json({
    message:"room already exists",
    error:error,
  })
 }
})


//room list logic
app.get ('/room/list',middleware,async (req:Request,res:Response,next:NextFunction) =>{
  //@ts-ignore
  const userId = req.body.userId;
  try {
    const rooms = await prismaClient.room.findMany({
      where:{
        adminId:userId,
      }
    })
    res.json({
      message:"room list",
      rooms:rooms,
    })
  } catch (error) {
    res.status(400).json({
      message:"room list error",
      error:error,
    })
    
  }
})

//chat room chats

app.get('/chat/:roomId', async (req:Request,res:Response,next:NextFunction)=>{
  const roomId = req.params.roomId;
  try {
    const chats = await prismaClient.chat.findMany({
      where:{
        roomId: Number(roomId),
      },
      orderBy:{
        id:'desc'
      },
      take:100,
    })
    res.json({
      message:"chat list updated",
    })
  }
  catch(error){
    res.status(400).json({
      message:"chat error",
      error:error,
  
    })
  }
})

//get room by id/slug

app.get('/room/:slug',async(req:Request,res:Response,)=>{

  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where:{
      slug:slug,
    }
  })
  res.json({
    message:"room found",
    room:room,
  })
})



app.listen(5000, () => {
  console.log('listening on port 5000');
});