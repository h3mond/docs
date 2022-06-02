import { model, ObjectId, Schema } from "mongoose";

export interface ITemplate {
  title: string;
  description: string;
  fileId: ObjectId;
}

const templateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// templateSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
// 
// templateSchema.set("toJSON", {
//   virtuals: true,
// });

const Template = model<ITemplate>("Template", templateSchema);

export { Template };
