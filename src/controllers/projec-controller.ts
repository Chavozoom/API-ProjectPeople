import { NotAuthorizedError, NotFoundError } from "@isctickets/common";
import { Project } from "../models/Projects";
import { Request, Response, NextFunction } from "express";

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find({});
    if (projects.length > 0) {
      return res.status(200).send(projects);
    }
    return res.status(200).send({ message: "No projects found" });
  } catch (error) {
    next(error);
  }
};

export const getProjectsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId });
    if (projects.length == 0) {
      return res.status(200).send({ message: "No projects found" });
    }
    return res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, stacks } = req.body;
    const project = Project.build({
      title,
      description,
      stacks,
      userId: req.currentUser!.id,
    });
    await project.save();
    return res.status(201).send(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      throw new NotFoundError();
    }
    return res.status(200).send(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, stacks } = req.body;
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError();
    }
    if (project.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    project.set({
      title,
      description,
      stacks,
      userId: req.currentUser!.id,
    });

    await project.save();
    return res.status(201).send(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError();
    }
    if (project.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    await Project.findByIdAndDelete(project.id);
    return res.status(204).send({
      message: "Projeto deletado com sucesso",
    });
  } catch (error) {
    next(error);
  }
};
