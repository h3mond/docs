import { model, Schema } from "mongoose";

export interface IAccount {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const accountSchema = new Schema<IAccount>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Account = model<IAccount>("Account", accountSchema);

export { Account };
