import {
  createNewUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller";
import { currentUser, validateRequest } from "@isctickets/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";

const router = Router();

//Get the current user
router.get("/currentuser", currentUser, (req: Request, res: Response) => {
  return res.status(200).send({ currentUser: req.currentUser || null });
});

//Sign up a new user
router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validateRequest,
  createNewUser
);

//Sign a user
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  loginUser
);

//sign out the user
router.post("/signout", async (req: Request, res: Response) => {
  req.session = null;
  return res.status(200).send({});
});

//update the user data
router.put("/", currentUser, updateUser);

//delete user
router.delete("/", currentUser, deleteUser);

export { router as authRoute };
