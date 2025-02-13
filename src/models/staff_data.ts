import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for TypeScript
interface IData extends Document {
  phone: string;
  signed_up: boolean;
}


const DataSchema = new Schema<IData>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, 
    },
    signed_up: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const Data: Model<IData> = mongoose.models.Data || mongoose.model<IData>("Data", DataSchema);

export default Data;
