import { Request, Response } from "express";
import { Events } from "../models/Events";
import { Users } from "../models/Users";
import { Clients } from "../models/Clients";


export class EventsControllers {
    async listAll(req: Request, res: Response): Promise<Response> {
        let events: Events[] = await Events.find();

        return res.status(200).json(events);
    }

    async listOnline(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let event: Events[] = await Events.find({
            where: { situation: "Ativo" },
        });
        return res.status(200).json(event);
    }

    async validationDate(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let aux: Events[] = await Events.find({
            where: { situation: "Ativo" },
        });

        let events = aux.filter(event => event.endDate > new Date());

        events.forEach((element) => element.situation = 'Inativo', (element) => element.save());


        return res.status(200).json(aux);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let client: Events = res.locals.user;

        return res.status(200).json(client);
    }

    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let startDate = body.startDate;
        let endDate = body.endDate;
        let user: Users | null = await Users.findOneBy({ id: body.user })

        if (!user) {
            return res.status(400).json({ message: "Usúario não encontrado" })
        }

        let client: Events = await Events.create({
            name: body.name,
            type: body.type,
            address: body.address,
            description: body.description,
            price: body.price,
            startDate: startDate,
            endDate: endDate,
            situation: body.situation,
            imgUrl: body.imgUrl,
            user: user,
        }).save();

        return res.status(200).json(client);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let event: Events = res.locals.event;

        let startDate = body.startDate;
        let endDate = body.endDate;

        let user: Users | null = await Users.findOneBy({ id: body.user })

        if (!user) {
            return res.status(400).json({ message: "Usúario não encontrado" })
        }

        event.name = body.name;
        event.type = body.type;
        event.address = body.address;
        event.price = body.price;
        event.description = body.description;
        event.startDate = startDate;
        event.endDate = endDate;
        event.user = user;
        event.situation = body.situation;
        event.imgUrl = body.imgUrl;


        await event.save();

        return res.status(200).json(event);
    }
        
    async delete(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let events: Events = res.locals.event;

        if (!events) {
            return res.status(200).json({ message: "Evento não encontrado" });
        }

        events.situation = 'Inativo';

        await events.save();

        return res.status(200).json(events);
    }
}