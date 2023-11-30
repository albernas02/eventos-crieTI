import { AutenticationController } from '../controllers/AutenticationUserController';
import { Router, } from "express";

let rotas: Router = Router();

let autenticacaoController: AutenticationController = new AutenticationController();

rotas.post('/loginUsers', autenticacaoController.login);
rotas.get('/auth/users/check', autenticacaoController.authCheck);

export default rotas;