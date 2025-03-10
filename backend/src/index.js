import express from 'express'
import authRoute from './routes/auth.route.js'
import message from './routes/message.route.js'
const app=express()


app.use("api/auth/",authRoute)
app.use("api/message/",message)
 const PORT= 4000
app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    
})