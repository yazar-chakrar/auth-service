import { config } from '@auth/config/config';
import { AuthModel } from '@auth/models/auth.model';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { IAuthDocument, winstonLogger, firstLetterUppercase, lowerCase } from '@yazar-chakrar/brikoula-shared';
import { sign } from 'jsonwebtoken';
import { omit } from 'lodash';
import { Model, Op } from 'sequelize';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument | undefined> {
  try {
    log.log('info', 'AuthService Provider publishDirectMessage() method error:', { data });
    const result: Model = await AuthModel.create(data);
    await result.save();
    log.log('info', 'AuthService Provider publishDirectMessage() method error:', { result });
    console.log(result);
    const messageDetails = {
      username: result.dataValues.username!,
      email: result.dataValues.email!,
      profilePicture: result.dataValues.profilePicture!,
      country: result.dataValues.country!,
      createdAt: result.dataValues.createdAt!,
      type: 'auth'
    };
    await publishDirectMessage(
      authChannel,
      'brikoula-client-update',
      'user-client',
      JSON.stringify(messageDetails),
      'Client details sent to client service.'
    );
    const userData: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;
    console.log(userData);
    return userData;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserById(authId: number): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { id: authId },
      attributes: {
        exclude: ['password']
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsername(username: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { username: firstLetterUppercase(username) }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { email: lowerCase(email) }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: {
        [Op.or]: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }]
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { emailVerificationToken: token },
      attributes: {
        exclude: ['password']
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserByPasswordToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: {
        [Op.and]: [{ passwordResetToken: token }, { passwordResetExpires: { [Op.gt]: new Date() } }]
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function updateVerifyEmailField(authId: number, emailVerified: number, emailVerificationToken?: string): Promise<void> {
  try {
    await AuthModel.update(
      !emailVerificationToken
        ? {
            emailVerified
          }
        : {
            emailVerified,
            emailVerificationToken
          },
      { where: { id: authId } }
    );
  } catch (error) {
    log.error(error);
  }
}

export async function updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<void> {
  try {
    await AuthModel.update(
      {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration
      },
      { where: { id: authId } }
    );
  } catch (error) {
    log.error(error);
  }
}

export async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    await AuthModel.update(
      {
        password,
        passwordResetToken: '',
        passwordResetExpires: new Date()
      },
      { where: { id: authId } }
    );
  } catch (error) {
    log.error(error);
  }
}

export function signToken(id: number, email: string, username: string): string {
  return sign(
    {
      id,
      email,
      username
    },
    config.JWT_TOKEN!
  );
}
