import { getCustomRepository } from "typeorm";

import { compare } from "bcryptjs";

import { UsersRepositories } from "../repositories/UsersRepositories"
import { sign } from "jsonwebtoken";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {

  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    // Verificar se email existe
    const user = await usersRepositories.findOne({
      email
    })

    if(!user) {
      throw new Error("Email/Password incorrect")
    }

    // Verificar se a senha está correta
    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    // Gerar o token
    const token = sign({
        email: user.email
      }, "23caca282bc9029ef5bf47d67fb93dc8", {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return token;
  }
}

export { AuthenticateUserService }