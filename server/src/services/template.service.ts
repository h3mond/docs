import { TemplateHandler } from "easy-template-x";
import { createReadStream } from "fs";
import mongoose from "mongoose";
import { Template } from "../models/template.model";
import { stream2buffer } from "../utils/stream2buff.util";

export class TemplateService {
  protected templatesBucket: any;

  constructor() {
    const db = mongoose.connections[0].db;
    this.templatesBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "templates",
    });
  }

  /**
   * @param {any} template
   * @param {any} data
   * @returns {Promise<Buffer>}
   */
  async generate(template: any, data: any = {}): Promise<Uint8Array> {
    const templateBuf = await this.getFileById(template.fileId);

    const handler = new TemplateHandler();
    const buffer = await handler.process(templateBuf, data);

    return buffer;
  }

  /**
   * uploads document and file to mongodb
   * @param {string} title
   * @param {string} description
   * @param {string} mFile
   * @returns {Promise<any>}
   */
  async uploadTemplate(
    title: string,
    description: string,
    mFile: Express.Multer.File
  ): Promise<any> {
    return new Promise((res, rej) => {
      createReadStream(mFile.path)
        .pipe(this.templatesBucket.openUploadStream(mFile.originalname))
        .on("finish", async (file: any) => {
          const template = new Template({
            title,
            description,
            fileId: new mongoose.Types.ObjectId(file._id),
          });
          await template.save();
          res(template);
        })
        .on("error", (err: any) => {
          rej(err);
        });
    });
  }

  /**
   * returns template by id
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<Buffer>}
   */
  async getFileById(id: mongoose.Types.ObjectId): Promise<Buffer> {
    return await stream2buffer(this.templatesBucket.openDownloadStream(id));
  }
}
