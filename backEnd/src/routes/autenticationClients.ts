import { AutenticationController } from '../controllers/AutenticationClientsController';
import { Router, } from "express";

let rotas: Router = Router();

let autenticacaoController: AutenticationController = new AutenticationController();

rotas.post('/loginClients', autenticacaoController.login);
rotas.get('/auth/clients/check', autenticacaoController.authCheck);

export default rotas;