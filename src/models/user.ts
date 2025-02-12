import mongoose, { Schema, Document, Model } from "mongoose";


interface IUser extends Document {
  mobileNumber: string;
  username: string;
  password: string;
}

// Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, 
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
  },
  { timestamps: true }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
