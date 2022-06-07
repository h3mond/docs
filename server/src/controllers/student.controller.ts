import { Request, Response } from "express";
import {Account} from "../models/account.model";
import { Document } from "../models/document.model";
import { Student } from "../models/student.model";
import {AccountService} from "../services/account.service";
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

/**
 *
 */
export const addHandler = async (req: Request, res: Response) => {
  const {
    name,
    surname,
    middleName,
    program,
    course,
    email,
    admissionDate,
    graduationDate,
    birthdate,
  } = req.body;
  try {
    const student = new Student({
      name,
      surname,
      middleName,
      program,
      course: Number(course),
      email,
      admissionDate: new Date(admissionDate),
      graduationDate: new Date(graduationDate),
      birthdate: new Date(birthdate),
    });
  } catch (e) {
    LoggerService.log.error(e.message);
    res.status(500).json({
      message: "Oops! Something went wrong!",
    });
  }
};

/**
 *
 */
export const initHandler = async (req: Request, res: Response) => {
  try {
    const service = new AccountService();
    await service.register("Admin", "Admin", "admin@astanait.edu.kz", "admin123");

    const student = new Student({
      name: "Bekarys",
      surname: "Moldakhmetov",
      middleName: "Moldakhmetov",
      program: "Software Engineering",
      course: 3,
      email: "b.moldakhmetov@astanait.edu.kz",
      admissionDate: new Date("2019-09-03"),
      graduationDate: new Date("2022-06-30"),
      birthdate: new Date("2001-11-19"),
    });
    await student.save();
    res.json({})
  } catch (e) {
    LoggerService.log.error(e.message);
    res.status(500).json({
      message: "Oops! Something went wrong!",
    });
  }
};
