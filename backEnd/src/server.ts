import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { basicAuthClient } from "./middlewares/basics-auth-client";
import { basicAuthUser } from "./middlewares/basics-auth-user";
import usersRoutes from './routes/users'
import clientsRoutes from './routes/clients'
import eventsRoutes from './routes/events'
import autentiticationUsersRoutes from './routes/autenticationUser'
import autenticationClientsRoutes from './routes/autenticationClients'
import exportRoutes from './routes/export'

let server: Express = express();
let port: Number = Number(process.env.server_port || 3000);

server.use(cors());
server.use(express.json());

server.use(autentiticationUsersRoutes);
server.use(basicAuthClient, autenticationClientsRoutes);
server.use(basicAuthUser, usersRoutes);
server.use(basicAuthClient, clientsRoutes);
server.use(basicAuthUser, eventsRoutes);
server.use(basicAuthUser, exportRoutes);

server.use((req: Request, res: Response, next: NextFunction) => {
    console.log('[' + (new Date) + ']' + req.method + ' ' + req.url);
    next();
});

export default {
    start() {
        server.listen(port, () => {
            console.log(`servidor iniciado na porta ${port}`);
        });
    },
};