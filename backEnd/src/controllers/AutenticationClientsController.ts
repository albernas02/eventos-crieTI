import { Request, Response } from "express";
import { Clients } from "../models/Clients";
import bcrypt from "bcrypt";

export class AutenticationController {

    async login(req: Request, res: Response): Promise<Response> {
        let email: string = req.body.email;
        let password: string = req.body.password;
        console.log(email, password)

        let user: Clients | null = await Clients.findOne({
            where: { email: email },
            select: ["id", "email", "password", "name"],
        });
        if (!user) {
            return res.status(401).json({ mensagem: "Dados não encontrados!" });
        }
        let resultado = await bcrypt.compare(password, user.password);

        if (!resultado) {
            return res.status(401).json({ message: "Senha inválida!" });
        }
        let token: string = Buffer.from(`${email}:${password}`).toString("base64");

        const { password: passworduser, ...userWithoutPassword } = user;

        return res.status(200).json({ token, type: "Basic", user: userWithoutPassword });
    }
}