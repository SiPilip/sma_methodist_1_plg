import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string; // Akan disimpan dalam bentuk Hash
  nama: string;
  role: "SuperAdmin" | "Editor" | "Osis";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true 
    },
    password: { type: String, required: true },
    nama: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["SuperAdmin", "Editor", "Osis"], 
      default: "Editor" 
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;