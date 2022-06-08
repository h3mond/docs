import { Request, Response } from "express";
import {readFile, unlink, writeFile} from "fs/promises";
import mongoose from "mongoose";
import { Document } from "../models/document.model";
import { DocumentService } from "../services/document.service";
import { LoggerService } from "../services/logger.service";
import NCAService from "../services/nca.service";

/**
 *
 */
export const signHandler = async (req: Request, res: Response) => {
  const { id, email } = req.body;

  if (!id) {
    LoggerService.log.error("Id was not send!");
    res.status(500).json({
      message: "Id was not sent!",
    });
    return;
  }

  if (!email) {
    LoggerService.log.error("Email was not send!");
    res.status(500).json({
      message: "Email was not sent!",
    });
    return;
  }

  try {
    const ncaService = new NCAService();
    const data = Buffer.from('Something interesting here').toString('base64')
    const resp = await ncaService.sign(data)
    console.log(resp);
    res.json(resp);
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
    return;
  }
};

/**
 *
 */
export const verifyHandler = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    LoggerService.log.error("File was not send!");
    res.status(500).json({
      message: "Document was not send!",
    });
    return;
  }

  try {
    const service = new NCAService();
    const buff = await readFile(file.path)
    const resp = await service.verify(buff.toString('base64'))
    res.json(resp);
  } catch (e) {
    LoggerService.log.error(e.message);
    res.status(500).json({
      message: "Something got wrong",
    });
    return;
  }
};

/**
 *
 */
export const showHandler = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({
      message: "Id was not found",
    });
    return;
  }

  try {
    const document = await Document.findById(id);
    res.json(document);
  } catch (e) {}
  res.json({});
};

/**
 *
 */
export const studentHandler = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    res.status(400).json({
      message: "Id was not found",
    });
    return;
  }
  try {
    const documents = await Document.find({
      studentEmail: email as string,
    })
    res.json(documents.reverse());
  } catch (e) {
    LoggerService.log.error("Something got wrong");
    res.status(500).json({
      message: "Something got wrong",
    });
    return;
  }
};

/**
 *
 */
export const downloadHandler = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    LoggerService.log.error("Id was not found");
    res.status(400).json({
      message: "Id was not found",
    });
    return;
  }

  try {
    const documentService = new DocumentService();
    const document = await Document.findById(id)
    if (document === null) {
      throw new Error("Document was not found")
    }
    const fileBuff = await documentService.getFileByDocumentId(
      new mongoose.Types.ObjectId(String(document.documentId))
    );
    const filepath = './tmp/' + document.title + '-' + (Math.random() + 1).toString(36).substring(7) + '.pdf';
    await writeFile(filepath, fileBuff)
    res.download(filepath, (err) => {
      if (err) {
        LoggerService.log.error(err);
      }
      unlink(filepath);
    });
  } catch (e) {
    LoggerService.log.error(e.message);
    res.status(500).json({
      message: e.message
    });
    return;
  }
};
