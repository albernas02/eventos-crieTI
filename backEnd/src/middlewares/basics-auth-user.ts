import { Request, Response, NextFunction } from "express";
import { Users } from "../models/Users";
import bcrypt from "bcrypt";


export async function basicAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    let authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Credenciais nao informadas" });
    }

    let [type, token] = authorization.split(" ");

    if (!type || type != "Basic") {
        return res.status(401).json({ mensagem: "Tipo de autenticacao invalidos" });
    }

    let [email, password] = Buffer.from(token, "base64").toString("utf8").split(":");

    let user: Users | null = await Users.findOne({
        where: { email: email }, //compara todos os email com o email digitado
        select: ["id", "email", "password"], //busca mesmo que mande nao mostrar a nivel de db
    });

    if (!user) {
        // se nao encontrar nenhum
        return res.status(401).json({ message: "Dados não encontrados!" });
    }

    let resultado = await bcrypt.compare(password, user.password); //substitui a função que estava usando

    if (!resultado) {
        return res.status(401).json({ message: "Senha inválida!" }); // essas mensagens são usados no navegador
    }

    return next();
}