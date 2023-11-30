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
        let token: string = btoa(`${email}:${password}`);

        const { password: passworduser, ...userWithoutPassword } = user;

        return res.status(200).json({ token, type: "Basic", user: userWithoutPassword });
    }


    async authCheck(req: Request, res: Response): Promise<Response> {
        console.log(req.headers);
        let token = null;
        let authorization = req.headers.authorization;
        if (authorization) {
            token = authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ mensagem: "Usuário não autenticado!" });
        }
    
        let emailPass = atob(token);
console.log({emailPass})

        let [ email, password ] = emailPass.split(":");
        console.log({email, password})
        let user: Users | null = await Users.findOne({
            where: { email: email },
            select: ["id", "email", "password", "name"],
        });
        if (!user) {

        console.log({erro: "Dados"})
            return res.status(401).json({ mensagem: "Dados não encontrados!" });
        }
        let result = await bcrypt.compare(password, user.password);
console.log({ result });
        if (!result) {
            return res.status(401).json({ message: "Senha inválida!" });
        }

        console.log({msg: "200"})
        return res.status(200).json({ message: "ok"});
    }
}