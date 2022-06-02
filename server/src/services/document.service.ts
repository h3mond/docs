import { createReadStream } from "fs";
import mongoose from "mongoose";
import {Stream} from "stream";
import { Document } from "../models/document.model";
import {stream2buffer} from "../utils/stream2buff.util";

export class DocumentService {
  protected cmsBucket: any;
  protected documentsBucket: any;

  constructor() {
    const db = mongoose.connections[0].db;
    this.cmsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "cms",
    });
    this.documentsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "documents",
    });
  }

  /**
   * uploads document to gridfs
   * @retun {string} filename
   */
  async uploadDocument(
    studentEmail: string,
    title: string,
    filepath: string
  ): Promise<any> {
    return new Promise((res, rej) => {
      createReadStream(filepath)
        .pipe(this.documentsBucket.openUploadStream(title + (new Date()).getTime()))
        .on("finish", async (file: any) => {
          const template = new Document({
            title,
            studentEmail,
            cmsId: new mongoose.Types.ObjectId(file._id),
            documentId: new mongoose.Types.ObjectId(file._id),
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
   *
   */
  async getFileByDocumentId(id: mongoose.Types.ObjectId): Promise<Buffer> {
    const document = await Document.findById(id);

    if (document === null) {
      throw new Error("Document was not found.");
    }

    return await stream2buffer(
      this.documentsBucket.openDownloadStream(document.documentId)
    );
  }

  /**
   * upload cms
   * @return {string} filename
   */
  async uploadCms(filename: string): Promise<mongoose.Types.ObjectId> {
    return null;
  }

  /**
   * returns student documents
   * @param {string} email
   */
  async getStudentDocuments(email: string) {
    return null;
  }
}
