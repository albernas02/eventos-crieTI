import { Request, Response } from "express";
import { Events } from "../models/Events";
import { Users } from "../models/Users";
import { format } from "date-fns";


export class EventsControllers {
    async listAll(req: Request, res: Response): Promise<Response> {
        let events: Events[] = await Events.find();

        return res.status(200).json(events);
    }

    async listOnline(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let event: Events[] = await Events.find({
            where: { situation: "A" },
        });
        return res.status(200).json(event);
    }
    async validationDate(req: Request, res: Response): Promise<Response> {
        let name = req.query.name;

        let aux: Events[] = await Events.find({
            where: { situation: "A" },
        });

        // let events = aux.filter(event => event.endDate > new Date());

        // events.forEach((element) => element.situation = 'I', (element) => element.save());


        return res.status(200).json(aux);
    }


    async find(req: Request, res: Response): Promise<Response> {
        let client: Events = res.locals.user;

        return res.status(200).json(client);
    }

    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        // let user: Users | any = localStorage.getItem('user');
        let user: Users | null = await Users.findOneBy({ id: body.user })

        if (!user) {
            return res.status(400).json({ message: "Usúario não encontrado" })
        }

        let client: Events = await Events.create({
            name: body.name,
            type: body.type,
            address: body.address,
            description: body.description,
            startDate: body.startDate,
            endDate: body.endDate,
            situation: 'A',
            user: user,
        }).save();

        return res.status(200).json(client);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let event: Events = res.locals.event;

        let user: Users | null = await Users.findOneBy({ id: body.user })
        // let user: Users | any = localStorage.getItem('user');

        if (!user) {
            return res.status(400).json({ message: "Usúario não encontrado" })
        }

        event.name = body.name;
        event.type = body.type;
        event.address = body.email;
        event.description = body.password;
        event.startDate = body.phone;
        event.endDate = body.cpf;
        event.user = user;

        await event.save();

        return res.status(200).json(event);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let events: Events = res.locals.event;

        if (!events) {
            return res.status(200).json({ message: "Evento não encontrado" });
        }

        events.situation = 'I';

        await events.save();

        return res.status(200).json(events);
    }
}