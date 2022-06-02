import { Request, Response } from "express";
import {unlink, writeFile} from "fs/promises";
import mongoose from "mongoose";
import { Document } from "../models/document.model";
import { DocumentService } from "../services/document.service";
import { LoggerService } from "../services/logger.service";

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

  if (email) {
    LoggerService.log.error("Email was not send!");
    res.status(500).json({
      message: "Email was not sent!",
    });
    return;
  }

  try {
    // send file to sign
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
  const documentPath = req.files;
  res.json({});
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
    });
    res.json(documents);
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

  let fileName = '';
  try {
    const documentService = new DocumentService();
    const fileBuff = await documentService.getFileByDocumentId(
      new mongoose.Types.ObjectId(id as string)
    );
    // res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    // res.setHeader('Content-Dispoition', 'attachment; filename=Document.docx');
    fileName = './tmp/Document-' + (Math.random() + 1).toString(36).substring(7) + '.docx';
    await writeFile(fileName, fileBuff)
    res.download(fileName);
  } catch (e) {
    LoggerService.log.error("Something got wrong");
    res.status(500).json({
      message: "Something got wrong",
    });
    return;
  }
};
