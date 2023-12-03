import { NextFunction, Request, Response, Router } from "express";
import { ExportController } from "../controllers/ExportController";
import { Clients } from "../models/Clients";
import { Events } from "../models/Events";
let controller: ExportController = new ExportController();

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
        return res.status(422).json({ error: "Evento nao encontrado" });
    }
    res.locals.event = event;

    return next();
}
let rotas: Router = Router();
rotas.get("/pdf", controller.downloadPdf);
rotas.get("/pdfPresence/:id/:event", controller.sendPdfPresence);
rotas.get("/csv", controller.listCsv);
rotas.post("/emailWelcome", controller.sendEmailWelcome);
rotas.post("/emailBuy/:id", validate, validateEvent, controller.sendEmailBuy);

export default rotas;