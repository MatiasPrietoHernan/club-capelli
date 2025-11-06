import mongoose, { type Document, Schema } from "mongoose"

export interface ISessions extends Document {
  token: string
  phone:string
}


const sessionSchema= new Schema<ISessions>({
    token:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
})

export default mongoose.models.sessions || mongoose.model<ISessions>("sessions", sessionSchema)
