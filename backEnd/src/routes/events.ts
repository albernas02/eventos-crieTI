import { Router, Request, Response, NextFunction } from "express";
import { Clients } from "../models/Clients";
import { EventsControllers } from "../controllers/EventsControllers";
import * as yup from "yup";
import { Not } from "typeorm";
import { Events } from "../models/Events";

let controller: EventsControllers = new EventsControllers();

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let schema = yup.object({
        name: yup.string().min(3).max(255).required(),
        address: yup.string().min(3).max(255).required(),
        description: yup.string().max(255).required(),
        startDate: yup.string().required(),
        endDate: yup.string().required(),
        user: yup.number().min(1).required(),
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

    let event: Events | null = await Events.findOneBy({ id });

    if (!event) {
        return res.status(422).json({ error: "Usuário nao encontrado" });
    }
    res.locals.event = event;

    return next();
}

async function validarSeEmailExiste(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let name: string = req.body.name;
    let id: number | undefined = req.params.id ? Number(req.params.id) : undefined;

    let user: Events | null = await Events.findOneBy({ name, id: id ? Not(id) : undefined });
    if (user) {
        return res.status(422).json({ error: "Email ja cadastrado" });
    }
    return next();
}

let rotas: Router = Router();
rotas.get("/events", controller.listAll);
rotas.get("/events/:id", validar, controller.find);
rotas.post("/events", validarPayload, validarSeEmailExiste, controller.create);
rotas.put("/events/:id", validar, validarPayload, validarSeEmailExiste, controller.update);
rotas.delete("/events/:id", validar, controller.delete);
// rotas.get("/userscsv",controller.gerarCSVusers);

export default rotas;