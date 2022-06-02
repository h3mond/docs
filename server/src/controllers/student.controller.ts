import { Request, Response } from "express";
import { Document } from "../models/document.model";
import { Student } from "../models/student.model";
import { LoggerService } from "../services/logger.service";

/**
 *
 */
export const getHandler = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    LoggerService.log.error("Email was not send");
    res.status(400).json({
      message: "Email was not send!",
    });
    return;
  }

  try {
    const student = await Student.findOne({ email: email as string });
    if (student === null) {
      res.status(400).json({
        message: "Student was not found",
      });
      return;
    }
    res.json(student);
  } catch (e) {
    LoggerService.log.error("Error", e.message);
    res.status(500).json({
      message: "Oops! Something went wrong!",
    });
  }
};

/**
 *
 */
export const documentsHandler = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    LoggerService.log.error("Email was not sent!");
    res.status(400).json({
      message: "Email was not sent!",
    });
    return;
  }

  try {
    const documents = await Document.find({ studentEmail: email });
    res.json({ documents });
  } catch (e) {
    LoggerService.log.error(e.message);
    res.status(500).json({
      message: "Oops! Something went wrong!",
    });
  }
};
