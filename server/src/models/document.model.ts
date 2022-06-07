import { model, ObjectId, Schema } from "mongoose";

export interface IDocument {
  title: string;
  studentEmail: string;
  cmsId: ObjectId;
  documentId: ObjectId;
}

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    studentEmail: { type: String, required: true },
    documentId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Document = model<IDocument>("Document", documentSchema);

export { Document };
