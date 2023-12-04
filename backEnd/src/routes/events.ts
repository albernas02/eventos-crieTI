import { Router, Request, Response, NextFunction } from "express";
import { EventsControllers } from "../controllers/EventsControllers";
import * as yup from "yup";
import { Events } from "../models/Events";

let controller: EventsControllers = new EventsControllers();

async function validarPayload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let schema = yup.object({
        name: yup.string().min(3).max(255).required(),
        type: yup.string().min(3).max(255).required(),
        description: yup.string().max(255).required(),
        price: yup.string().min(3).max(255).required(),
        address: yup.string().min(3).max(255).required(),
        startDate: yup.string().required(),
        endDate: yup.string().required(),
        user: yup.number().min(1).required(),
        situation: yup.string().nullable(),
        imgUrl: yup.string().nullable()
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

let rotas: Router = Router();
rotas.get("/events", controller.listAll);
rotas.get("/events/:id", validar, controller.find);
rotas.post("/events", validarPayload, controller.create);
rotas.put("/events/:id", validar, validarPayload, controller.update);
rotas.delete("/events/:id", validar, controller.delete);

export default rotas;