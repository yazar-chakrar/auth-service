import { AuthModel } from '@auth/models/auth.model';
import { loginSchema } from '@auth/schemas/signin.schema';
import { getUserByEmail, getUserByUsername, signToken } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, isEmail } from '@yazar-chakrar/brikoula-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

export async function signin(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignIn read() method error');
  }
  const { username, password, browserName, deviceType } = req.body;
  const isValidEmail: boolean = isEmail(username);
  const existingUser: IAuthDocument | undefined = !isValidEmail ? await getUserByUsername(username) : await getUserByEmail(username);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }
  const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(password, `${existingUser.password}`);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }

  const message = 'User logedin successfully';
  const userJWT = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  const userData = omit(existingUser, ['password']);

  res.status(StatusCodes.OK).json({ message, user: userData, token: userJWT, browserName, deviceType });
}
