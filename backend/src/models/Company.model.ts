import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  domain?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Company name is required'], 
      trim: true 
    },
    domain: { 
      type: String, 
      trim: true, 
      unique: true, 
      sparse: true 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);