import { getRepository } from "typeorm";
import { Student } from "../models/student.model";

export class StudentService {

  /**
   *
   */
  async getStudent(email: string): Promise<Student> {
    return await getRepository(Student).findOneBy({ email: email });
  }
}
