import { Router, Request, Response, NextFunction } from "express";
import { UsersControllers } from "../controllers/UsersControllers";
import { Users } from "../models/Users";
import * as yup from "yup";
import { Not } from "typeorm";
let controller: UsersControllers = new UsersControllers();

async function validarPayload(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    let schema = yup.object({
        name: yup.string().min(3).max(255).required(),
        email: yup.string().email().required(),
        password: yup.string().min(6).max(16).required(),
        phone: yup.string().min(9).max(15).required(),
        CPF: yup.string().min(11).max(13).required(),
        address: yup.string().min(3).max(255).required()
    });

    let payload = req.body;

    try {
        req.body = await schema.validate(payload, {
            abortEarly: false,
            stripUnknown: true,
        });
        return next();
    } catch (error) {

        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ erros: error.errors });
        }
        return res.status(500).json({ error: "ops" });
    }
}

async function validar(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    let id = Number(req.params.id);

    let user: Users | null = await Users.findOneBy({ id });

    if (!user) {
        return res.status(422).json({ error: "Usuário nao encontrado" });
    }
    res.locals.user = user;

    return next();
}

async function validarSeEmailExiste(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    let email: string = req.body.email;
    let id: number | undefined = req.params.id ? Number(req.params.id) : undefined;

    let user: Users | null = await Users.findOneBy({ email, id: id ? Not(id) : undefined });//quando o id do editar for igual o id
    if (user) {
        return res.status(422).json({ error: "Email ja cadastrado" });
    }
    return next();
}

let rotas: Router = Router();
rotas.get("/users", controller.list);
rotas.get("/users/:id", validar, controller.find);
rotas.post("/users", validarPayload, validarSeEmailExiste, controller.create);
rotas.put("/users/:id", validar, validarPayload, validarSeEmailExiste, controller.update);
rotas.delete("/users/:id", validar, controller.delete);
// rotas.get("/userscsv",controller.gerarCSVusers);

export default rotas;