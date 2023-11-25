import { Router, Request, Response, NextFunction } from "express";
import { Clients } from "../models/Clients";
import { ClientsControllers } from "../controllers/ClientsControllers";
import * as yup from "yup";
import { Not } from "typeorm";

let controller: ClientsControllers = new ClientsControllers();

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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

async function validar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let id = Number(req.params.id);

    let client: Clients | null = await Clients.findOneBy({ id });

    if (!client) {
        return res.status(422).json({ error: "Usuário nao encontrado" });
    }
    res.locals.client = client;

    return next();
}

async function validarSeEmailExiste(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let email: string = req.body.email;
    let id: number | undefined = req.params.id ? Number(req.params.id) : undefined;

    let client: Clients | null = await Clients.findOneBy({ email, id: id ? Not(id) : undefined });//quando o id do editar for igual o id

    if (client) {
        return res.status(422).json({ error: "Email ja cadastrado" });
    }
    return next();
}

let rotas: Router = Router();
rotas.get("/clients", controller.listAll);
rotas.get("/clients/:id", validar, controller.find);
rotas.post("/clients", validarPayload, validarSeEmailExiste, controller.create);
rotas.put("/clients/:id", validar, validarPayload, validarSeEmailExiste, controller.update);
rotas.delete("/clients/:id", validar, controller.delete);
// rotas.get("/userscsv",controller.gerarCSVusers);

export default rotas;