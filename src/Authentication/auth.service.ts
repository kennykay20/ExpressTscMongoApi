import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { authenticationPassword, random } from "../helpers";
import { createUser, getUserByEmail } from "../database/schemas/users";

@injectable()
export class AuthenticationService {
  constructor() {}
  registerUser = async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;
      //check
      if (!email || !password || !username) {
        return res.status(400).send("please enter your email, password and username");
      }
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).send("email already exist").end();
      }

      const salt = random();
      const user = await createUser({
        email,
        username,
        authentication: {
          password: authenticationPassword(salt, password),
          salt,
          sessionToken: "",
        },
      });
      delete user.authentication?.password;
      delete user.authentication?.salt;
      return res.status(201).json(user).end();
    } catch (error) {
      console.log(error);

      return res.status(400);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if(!email || !password) {
        return res.sendStatus(400).send("please enter your email and password")
      }
      const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

      if (!user) {
        return res.status(400).send('user not found');
      }

      const expectedHash = authenticationPassword(user?.authentication?.salt, password);
      if (user?.authentication?.password !== expectedHash) {
        return res.status(403).send('Incorrect password');
      }

      // create another salt to generate sessiontoken
      const salt = random();
      user.authentication.sessionToken = authenticationPassword(salt, user._id.toString());
      await user.save();

      res.cookie('REST-API-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/'});
      res.json(user);

    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }
}
