import axios from "axios";
import { readFileSync } from "fs";
import { CERT_PASSWORD, CERT_PATH, NCA_HOST } from "../env";

export default class NCAService {
  private readonly pk12: string;
  private readonly password: string;

  constructor() {
    this.pk12 = readFileSync(CERT_PATH).toString("base64");
    this.password = CERT_PASSWORD;
  }

  /**
   *
   */
  async sign(data: string) {
    const res = await axios.post(NCA_HOST, {
      version: "2.0",
      method: "cms.sign",
      params: {
        data,
        withTsp: true,
        p12array: [
          {
            alias: "",
            p12: this.pk12,
            password: this.password,
          },
        ],
      },
    });
    if (res.data?.status === 0) {
      return res.data;
    }
    throw new Error(res.data?.message);
  }

  /**
   *
   */
  async verify(cms: string) {
    try {
      const res = await axios.post(NCA_HOST, {
        version: "2.0",
        method: "cms.verify",
        params: {
          checkOcsp: true,
          checkCrl: true,
          cms,
        },
      });
      if (res.data?.status === 0) {
        return res.data.result;
      }
      throw new Error(res.data?.message);
    } catch (e) {
      console.log("Error", e.message);
    }
  }

  /**
   *
   */
  async extract(cms: string) {
    const res = await axios.post(NCA_HOST, {
      version: "2.0",
      method: "cms.extract",
      params: {
        cms,
      },
    });
    if (res.data?.status === 0) {
      return res.data;
    }
    throw new Error(res.data?.message);
  }
}
