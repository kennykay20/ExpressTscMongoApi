import { Request, Response } from "express";
import {
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById
} from "../database/schemas/users";

export class UserService {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await getUsers();
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(400);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      const checkUser = await getUserById(id);
      if (!checkUser) {
        return res.status(400).send(`user not found with id ${id}`);
      }
      checkUser.username = username;
      checkUser.email = email;
      const user = await updateUserById(id, checkUser);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteUser = await deleteUserById(id);
      res.status(200).json(deleteUser);
    } catch (error) {
      console.log(error);
      return res.status(400);
    }
  };
}
