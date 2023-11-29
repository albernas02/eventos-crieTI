import { Request, Response, NextFunction } from "express";
import { Clients } from "../models/Clients";
import bcrypt from "bcrypt";

export async function basicAuthClient(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: "Credenciais nao informadas" });
    }

    let [type, token] = authorization.split(" ");

    if (!type || type != "Basic") {
        return res.status(401).json({ message: "Tipo de autenticacao invalidos" });
    }

    let [email, password] = Buffer.from(token, "base64").toString("utf8").split(":");

    let client: Clients | null = await Clients.findOne({
        where: { email: email }, //compara todos os email com o email digitado
        select: ["id", "email", "password"], //busca mesmo que mande nao mostrar a nivel de db
    });

    if (!client) {
        // se nao encontrar nenhum
        return res.status(401).json({ message: "Dados não encontrados!" });
    }

    let resultado = await bcrypt.compare(password, client.password); //substitui a função que estava usando

    if (!resultado) {
        return res.status(401).json({ message: "Senha inválida!" }); // essas mensagens são usados no navegador

    }
    return next();
}