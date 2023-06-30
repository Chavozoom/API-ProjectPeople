import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@isctickets/common";
import { Password } from "../services/password";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, socialMedia } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ name, email, password, socialMedia });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: 86000,
      }
    );
    req.session = {
      jwt: userJwt,
    };

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  } catch (err) {
    return next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    // Autentication
    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate Jwt token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: 86000,
      }
    );
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, socialMedia } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new NotFoundError();
    }

    if (existingUser.id != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    existingUser.set({ name, password, socialMedia });
    await existingUser.save();

    return res.status(201).send(existingUser);
  } catch (err) {
    return next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.currentUser!;

    // Encontre e delete o usuário pelo ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundError();
    }

    req.session = null;
    return res.status(204).send({
      message: "Usuário deletado com sucesso",
    });
  } catch (err) {
    return next(err);
  }
};
