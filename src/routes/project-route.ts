import {
  getProjects,
  getProjectsByUser,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projec-controller";
import { currentUser, requireAuth, validateRequest } from "@isctickets/common";
import { body } from "express-validator";
import { Router } from "express";

const router = Router();

//Get all the projects
router.get("/", getProjects);

//get all the projects from an user
router.get("/user/:userId", currentUser, requireAuth, getProjectsByUser);

//Create a new project
router.post(
  "/",
  currentUser,
  requireAuth,
  [body("title").notEmpty(), body("description").notEmpty()],
  validateRequest,
  createProject
);

//Get a project by id
router.get("/:id", currentUser, requireAuth, getProjectById);

//update the project data
router.put(
  "/:id",
  currentUser,
  requireAuth,
  [body("title").notEmpty(), body("description").notEmpty()],
  validateRequest,
  updateProject
);

//delete a project
router.delete("/:id", currentUser, requireAuth, deleteProject);

export { router as projectRoute };
