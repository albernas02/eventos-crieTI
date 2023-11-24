import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { Clients } from "../models/Clients";
import { Users } from "../models/Users";


export class UsersControllers {
    async listAll(req: Request, res: Response): Promise<Response> {
        let clients: Clients[] = await Clients.find();

        return res.status(200).json(clients);
    }
    async listOnline(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let user: Users[] = await Users.find({
            where: { situation: "A" },
        });
        return res.status(200).json(user);
    }

    async listOffline(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let user: Users[] = await Users.find({
            where: { situation: "I" },
        });
        return res.status(200).json(user);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let client: Clients = res.locals.user;

        return res.status(200).json(client);
    }

    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let password = await bcrypt.hash(body.password, 10);
        
        let client: Clients = await Clients.create({
            name: body.name,
            email: body.email,
            password: password,
            phone: body.phone,
            CPF: body.cpf,
            address: body.address,
            situation: 'A'
        }).save();
        
        return res.status(200).json(client);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let client: Clients = res.locals.user;
        
        let password = await bcrypt.hash(body.password, 10);

        client.name = body.name;
        client.email = body.email;
        client.password = password;
        client.phone = body.phone;
        client.CPF = body.cpf;
        client.address = body.address;
        client.situation = 'A';

        await client.save();

        return res.status(200).json(client);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let clients: Clients = res.locals.clients;

        clients.situation = 'I';

        await clients.save();

        return res.status(200).json(clients);
    }
}