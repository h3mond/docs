import { model, Schema } from "mongoose";

export interface IStudent {
  name: string;
  surname: string;
  middleName: string;
  program: string;
  course: number;
  email: string;
  admissionDate: Date;
  graduationDate: Date;
  birthdate: Date;
}

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  middleName: { type: String, required: true },
  program: { type: String, required: true },
  course: { type: Number, required: true },
  email: { type: String, unique: true, required: true },
  admissionDate: { type: Date, required: true },
  graduationDate: { type: Date, required: true },
  birthdate: { type: Date, required: true },
});

const Student = model<IStudent>("Student", studentSchema);

export { Student };
