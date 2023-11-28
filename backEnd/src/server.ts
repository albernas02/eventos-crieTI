import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { basicAuth } from "./middlewares/basics-auth-user";
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
server.use(autenticationClientsRoutes);
server.use(usersRoutes);
server.use(clientsRoutes);
server.use(eventsRoutes);
server.use(exportRoutes);

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