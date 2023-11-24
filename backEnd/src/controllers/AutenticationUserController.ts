import { Request, Response } from "express";
import { Users } from "../models/Users";
import bcrypt from "bcrypt";

export class AutenticationController {

    async login(req: Request, res: Response): Promise<Response> {
        let email: string = req.body.email;
        let password: string = req.body.password;
        console.log("hello")

        let user: Users | null = await Users.findOne({
            where: { email: email },
            select: ["id", "email", "password", "name"],
        });
        if (!user) {
            return res.status(401).json({ mensagem: "Dados não encontrados!" });
        }
        let result = await bcrypt.compare(password, user.password);

        if (!result) {
            return res.status(401).json({ message: "Senha inválida!" });
        }
        let token: string = Buffer.from(`${email}:${password}`).toString("base64");

        const { password: passworduser, ...userWithoutPassword } = user;

        return res.status(200).json({ token, type: "Basic", user: userWithoutPassword });
    }
}