import { Request, Response } from "express";
import { Clients } from "../models/Clients";
import bcrypt from "bcrypt";

export class AutenticationController {

    async login(req: Request, res: Response): Promise<Response> {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user: Clients | null = await Clients.findOne({
            where: { email: email },
            select: ["id", "email", "password", "name"],
        });
        if (!user) {
            return res.status(401).json({ mensagem: "Usuário e senha não conferem!" });
        }
        let resultado = await bcrypt.compare(password, user.password);

        if (!resultado) {
            return res.status(401).json({ message: "Senha inválida!" });
        }
        let token: string = btoa(`${email}:${password}`);

        const { password: passworduser, ...userWithoutPassword } = user;

        return res.status(200).json({ token, type: "Basic", user: userWithoutPassword });
    }

    async authCheck(req: Request, res: Response): Promise<Response> {
        let token: string | null = null;
        let authorization = req.headers.authorization;
        if (authorization) {
            token = authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ mensagem: "Usuário não autenticado!" });
        }

        let emailPass = atob(token);
        let [email, password] = emailPass.split(":");

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

        return res.status(200).json({ message: "ok" });
    }
}