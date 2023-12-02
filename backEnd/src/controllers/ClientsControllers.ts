
import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { Clients } from "../models/Clients";
import { Events } from '../models/Events';

export class ClientsControllers {
    async listAll(req: Request, res: Response): Promise<Response> {
        let clients: Clients[] = await Clients.find();

        return res.status(200).json(clients);
    }
    async listOnline(req: Request, res: Response): Promise<Response> {
        let client: Clients[] = await Clients.find({
            where: { situation: "A" },
        });
        return res.status(200).json(client);
    }

    async listOffline(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let client: Clients[] = await Clients.find({
            where: { situation: "I" },
        });
        return res.status(200).json(client);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let client: Clients = res.locals.client

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
            CPF: body.CPF,
            address: body.address,
            situation: 'A'
        }).save();

        return res.status(200).json(client);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let client: Clients = res.locals.client;

        let password = await bcrypt.hash(body.password, 10);

        client.name = body.name;
        client.email = body.email;
        client.password = password;
        client.phone = body.phone;
        client.CPF = body.CPF;
        client.address = body.address;
        client.situation = 'A';

        await client.save();

        return res.status(200).json(client);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        let client: Clients = res.locals.client;

        client.situation = 'I';

        await client.save();

        return res.status(200).json(client);
    }
}