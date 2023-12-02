import { Request, Response } from "express";
import { Tickets } from "../models/Tickets";
import { Events } from "../models/Events";
import { Clients } from "../models/Clients";
import { ExportController } from "../controllers/ExportController"

let exportController: ExportController = new ExportController()


export class TicketControllers {

    async buy(req: Request, res: Response): Promise<Response> {
        let client = res.locals.client
        let event = res.locals.event

        let tickets: Tickets[] | null = await Tickets.find()

        for (let ticket of tickets) {
            if (ticket.client.id == client.id && ticket.event.id == event.id) {
                return res.status(404).json({ message: "Cliente já inscrito" })
            }
        }

        let ticket: Tickets = await Tickets.create({
            client,
            event,
            presence: false
        }).save();

        await exportController.sendEmailBuy(req, res);
        
        return res.status(200).json(ticket);
    }

    async listWithClient(req: Request, res: Response): Promise<Response> {
        let client: Clients = res.locals.client;

        let tickets: Tickets[] = await Tickets.find()
        let events: Events[] | null = [];

        for (let ticket of tickets) {
            if (ticket.client.id = client.id) {
                events.push(ticket.event)
            }
        }

        return res.status(200).json(events);
    }

    async checkIn(req: Request, res: Response): Promise<Response> {
        let client = res.locals.client
        let event: Events = res.locals.event

        let tickets: Tickets[] | null = await Tickets.find()
        let events: Events[] = [];

        for (let ticket of tickets) {
            if (ticket.client.id == client.id && ticket.event.id == event.id) {
                ticket.presence = true;
                await ticket.save();
            }
        }

        return res.status(200).json(tickets);
    }

    async desist(req: Request, res: Response): Promise<Response> {
        let client = res.locals.client
        let event: Events = res.locals.event

        let tickets: Tickets[] | null = await Tickets.find()

        for (let ticket of tickets) {
            if (ticket.client.id == client.id && ticket.event.id == event.id) {
                await ticket.remove();
            }
        }
        tickets = await Tickets.find()

        return res.status(200).json(tickets)
    }
}