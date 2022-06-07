import mongoose from "mongoose";
import { GridFSBucket } from "mongoose/node_modules/mongodb";
import { Document } from "../models/document.model";
import { stream2buffer } from "../utils/stream2buff.util";
import { FileService } from "./file.service";
import { LoggerService } from "./logger.service";

export interface UploadDocumentProps {
  email: string;
  title: string;
  filename: string;
  filepath: string;
}

export class DocumentService extends FileService {
  protected documentsBucket: GridFSBucket;

  constructor() {
    super("documents");
    const db = mongoose.connections[0].db;
    this.documentsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "documents",
    });
  }

  /**
   *
   */
  async uploadDocument(props: UploadDocumentProps) {
    let fileId = null;

    try {
      const file = await this.uploadFile(props.filename, props.filepath);
      fileId = file._id;

      const document = new Document({
        title: props.title,
        cmsId: file._id,
        documentId: file._id,
        studentEmail: props.email,
      });
      await document.save();

      return document;
    } catch (e) {
      LoggerService.log.error("Upload failed", e.message);
      if (fileId) await this.deleteFile(new mongoose.Types.ObjectId(fileId));
    }
  }

  /**
   *
   */
  async deleteDocument(id: mongoose.Types.ObjectId): Promise<void> {
    const document = await Document.findById(id);
    if (document === null) {
      throw new Error("Document was not found");
    }
    await this.deleteFile(id);
  }

  /**
   *
   */
  async getFileByDocumentId(id: mongoose.Types.ObjectId): Promise<Buffer> {
    return await stream2buffer(this.documentsBucket.openDownloadStream(id));
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
