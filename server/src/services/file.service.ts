import { createReadStream } from "fs";
import mongoose from "mongoose";
import { GridFSBucket, GridFSFile } from "mongoose/node_modules/mongodb";
import { stream2buffer } from "../utils/stream2buff.util";

export class FileService {
  /**
   * gridfs bucket
   */
  bucket: GridFSBucket;

  /**
   * @constructor
   * @param {string} bucketName name of bucket
   */
  constructor(bucketName: string) {
    const db = mongoose.connections[0].db;
    this.bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName,
    });
  }

  /**
   * uploads file to gridfs
   * @param {string} filename
   * @param {string} filepath
   * @returns {Promise<GridFile>}
   */
  protected async uploadFile(
    filename: string,
    filepath: string
  ): Promise<GridFSFile> {
    return new Promise((res, rej) => {
      createReadStream(filepath)
        .pipe(this.bucket.openUploadStream(filename))
        .on("finish", async (file: any) => {
          res(file);
        })
        .on("error", (err: any) => {
          rej(err);
        });
    });
  }

  /**
   * downloads file from gridfs
   * @param {mongoose.Types.ObjectId} id
   */
  protected async downloadFile(id: mongoose.Types.ObjectId): Promise<Buffer> {
    return await stream2buffer(this.bucket.openDownloadStream(id));
  }

  /**
   * deletes file from gridfs
   * @param {mongoose.Types.ObjectId} id
   * @returns {Promise<void>}
   */
  protected async deleteFile(id: mongoose.Types.ObjectId): Promise<void> {
    await this.bucket.delete(id);
  }
}
