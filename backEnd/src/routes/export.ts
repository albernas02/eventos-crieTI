import { Router } from "express";
import { ExportController } from "../controllers/ExportController";
let controller: ExportController = new ExportController();


let rotas: Router = Router();
rotas.get("/pdf", controller.downloadPdf);
rotas.get("/pdfPresence", controller.sendPdfPresence);
rotas.get("/csv", controller.listCsv);
rotas.post("/emailWelcome", controller.sendEmailWelcome);

export default rotas;