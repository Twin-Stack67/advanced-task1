import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },
    // CRITICAL FOR MULTI-TENANCY:
    // Links this user directly to a specific company/tenant
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);