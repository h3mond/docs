import { Request, Response } from "express";
import { AccountService } from "../services/account.service";
import { LoggerService } from "../services/logger.service";


/**
 *
 */
export const verifyController = async (req: Request, res: Response) => {
  return res.json({});
}

/**
 *
 */
export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(500).json({
      message: "Email was not found",
    });
    return;
  }

  if (!password) {
    res.status(500).json({
      message: "Password was not found",
    });
    return;
  }

  try {
    const accountService = new AccountService();
    const jwt = await accountService.login(email, password);
    res.json({
      jwt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/**
 *
 */
export const registerController = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  if (!name) {
    res.status(500).json({
      message: "Name was not found",
    });
    return;
  }

  if (!surname) {
    res.status(500).json({
      message: "Surname was not found",
    });
    return;
  }

  if (!email) {
    res.status(500).json({
      message: "Email was not found",
    });
    return;
  }

  if (!password) {
    res.status(500).json({
      message: "Password was not found",
    });
    return;
  }
  try {
    const accountService = new AccountService();
    await accountService.register(name, surname, email, password);
    res.json({ message: "Account was created" })
  } catch (error) {
    LoggerService.log.error(error);
    res.status(500).json({
      message: error.message
    });
  }
}

/**
 *
 */
export const getAdministrativeAccountsHandler = async (
  _: Request,
  res: Response
) => {
  const accountService = new AccountService();

  try {
    const accounts = await accountService.getAdministrativeAccounts();
    res.json(accounts);
  } catch (error) {
    LoggerService.log.error(error);
    res.status(500).json({
      message: "Error getting documents",
      error,
    });
  }
};
