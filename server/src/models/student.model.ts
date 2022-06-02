import { model, Schema } from "mongoose";

export interface IStudent {
  name: string;
  surname: string;
  email: string;
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
});

const Student = model<IStudent>("Student", studentSchema);

export { Student };
