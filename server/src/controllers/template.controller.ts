import { Request, Response } from "express";
import {readFile} from "fs";
import { unlink, writeFile } from "fs/promises";
import { title } from "process";
import { Student } from "../models/student.model";
import { Template } from "../models/template.model";
import { DocumentService } from "../services/document.service";
import { LoggerService } from "../services/logger.service";
import NCAService from "../services/nca.service";
import { TemplateService } from "../services/template.service";

const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

/**
 * Returns all all templates
 */
export const allHandler = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({});
    res.json(templates.reverse());
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};

/**
 * Generates new document by template
 */
export const generateHandler = async (req: Request, res: Response) => {
  const { id, email } = req.query;

  if (!id) {
    LoggerService.log.error("Id was not sent!");
    res.status(500).json({
      message: "Email was not sent!",
    });
    return;
  }

  if (!email) {
    LoggerService.log.error("Email was not sent!");
    res.status(500).json({
      message: "Email was not sent!",
    });
    return;
  }

  try {
    const ncaService = new NCAService();
    const templateService = new TemplateService();
    const documentService = new DocumentService();

    const template = await Template.findById(id);
    if (template === null) {
      throw new Error("Template was not found");
    }

    const student = await Student.findOne({ email });
    if (student === null) {
      throw new Error("Student was not found");
    }

    // generating docx file from template
    const templateBuf = Buffer.from(await templateService.generate(template, student));
    // converting it to pdf
    const pdfBuf = await libre.convertAsync(templateBuf, '.pdf', undefined);
    // signing document with nca service
    const signedDocument = await ncaService.sign(pdfBuf.toString('base64'));
    const buf = Buffer.from(signedDocument.cms, 'base64');
    const filepath = "./tmp/" + template.title + new Date().getTime();
    await writeFile(filepath, buf);

    const document = await documentService.uploadDocument({
      email: email as string,
      title: template.title,
      filename: template.title + '.pdf',
      filepath: filepath
    })

    res.json({
      id: document._id,
    });
    unlink(filepath);
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};

/**
 * Adds new template
 */
export const addHandler = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title) {
    LoggerService.log.error("Title was not sent!");
    res.status(500).json({
      message: "Title was not sent!",
    });
    return;
  }

  if (!description) {
    LoggerService.log.error("Description was not sent!");
    res.status(500).json({
      message: "Description was not sent!",
    });
    return;
  }

  if (!file) {
    LoggerService.log.error("Template was not sent!");
    res.status(500).json({
      message: "Document was not sent!",
    });
    return;
  }

  try {
    const templateService = new TemplateService();
    await templateService.uploadTemplate(title, description, file);
    await unlink(file.path);
    res.json({
      message: "File was uploaded",
    });
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};

/**
 * Removes template
 */
export const deleteHandler = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    LoggerService.log.error("Template was not found");
    res.status(500).json({
      message: "Template was not sent!",
    });
    return;
  }

  try {
    await Template.deleteOne({ _id: id });
    res.json({
      message: "Template was deleted",
    });
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};
