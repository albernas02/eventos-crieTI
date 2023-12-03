import { Clients } from '../models/Clients';
import { Events } from '../models/Events';
import { TicketControllers } from './../controllers/TicketControllers';
import { NextFunction, Request, Response, Router, } from "express";

let rotas: Router = Router();

let controller: TicketControllers = new TicketControllers();

async function validate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let id = Number(req.params.id);

    let client: Clients | null = await Clients.findOneBy({ id });

    if (!client) {
        return res.status(422).json({ error: "Usuário nao encontrado" });
    }
    res.locals.client = client;

    return next();
}
async function validateEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let id = Number(req.body.eventId)

    let event: Events | null = await Events.findOneBy({ id });

    if (!event) {
        return res.status(422).json({ error: "Evento não encontrado" });
    }
    res.locals.event = event;

    return next();
}


rotas.post('/buy/:id', validate, validateEvent, controller.buy);
rotas.get('/tickets/:id', validate, controller.listWithClient);
rotas.post('/checkIn/:id', validate, validateEvent, controller.checkIn);
rotas.post('/desist/:id', validate, validateEvent, controller.desist);

export default rotas;