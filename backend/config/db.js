import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://somtochukwunwanno:Valour161@cluster0.zrhla.mongodb.net/food-del').then(()=>console.log("DB Connected"));
   
}


