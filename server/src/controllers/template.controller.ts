import { Request, Response } from "express";
import {writeFile, unlink} from "fs/promises";
import mongoose from "mongoose";
import {title} from "process";
import {Student} from "../models/student.model";
import { Template } from "../models/template.model";
import {DocumentService} from "../services/document.service";
import { LoggerService } from "../services/logger.service";
import { TemplateService } from "../services/template.service";

/**
 *
 */
export const allHandler = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find({});
    res.json(templates);
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};

/**
 *
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
    const templateService = new TemplateService();
    const documentService = new DocumentService();
    const template = await Template.findById(id)
    const student = await Student.findOne({ email })

    if (template === null) {
      throw new Error("Template was not found");
    }

    if (student === null) {
      throw new Error("Student was not found");
    }

    const fileBuf = await templateService.generate(template, student)

    const fileName = "./tmp/" + template.title + (new Date()).getTime();
    await writeFile(fileName, fileBuf);

    const document = await documentService.uploadDocument(email as string, title, fileName)
    console.log('New created document', document._id);
    unlink(fileName);
    res.json({
      id: document._id
    })
  } catch (e) {
    LoggerService.log.error("Error: " + e.message);
    res.status(500).json({
      message: "Server Error: " + e.message,
    });
  }
};

/**
 *
 */
export const addHandler = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const file = req.file

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
 *
 */
export const deleteHandler = async (req: Request, res: Response) => {
  const { _id } = req.query;

  if (!_id) {
    LoggerService.log.error("Template was not found");
    res.status(500).json({
      message: "Template was not sent!",
    });
    return;
  }

  try {
    await Template.deleteOne({ _id: _id });
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

