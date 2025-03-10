import express from 'express'
import authRoute from './routes/authRoute.js'
const app=express()


app.use("api/auth/",authRoute)
 const PORT= 4000
app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    
})