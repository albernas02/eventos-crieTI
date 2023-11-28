import { Router } from "express";
import { ExportController } from "../controllers/ExportController";
let controller: ExportController = new ExportController();


let rotas: Router = Router();
rotas.get("/pdf", controller.downloadPdf);
rotas.get("/csv", controller.listCsv);
rotas.post("/emailWelcome", controller.sendEmailWelcome);
// rotas.put("/users/:id", controller.update);
// rotas.delete("/users/:id", controller.delete);
// rotas.get("/userscsv",controller.gerarCSVusers);

export default rotas;