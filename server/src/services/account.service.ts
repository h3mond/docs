import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env";
import { Account } from "../models/account.model";

export class AccountService {
  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string>}
   */
  async login(email: string, password: string): Promise<string> {
    const account = await Account.findOne({ email });
    if (!account) {
      throw new Error("Account was not found");
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const payload = {
      _id: account._id,
      name: account.name,
    };
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: 31556926 /* year */,
    });
  }

  /**
   *
   */
  async register(
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    const account = new Account();
    account.name = name;
    account.surname = surname;
    account.email = email;
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    account.password = hashedPassword;
    await account.save();
  }

  /**
   * Returns list of admins
   * @returns {Promise<string[]>}
   */
  async getAdministrativeAccounts(): Promise<string[]> {
    /**
     * TODO: move to DB. create main account
     */
    return ["b.moldakhmetov@astanait.edu.kz"];
  }

  /**
   * @returns {Promise<boolean>}
   */
  async addAdministrativeAccount(): Promise<boolean> {
    return false;
  }
}
