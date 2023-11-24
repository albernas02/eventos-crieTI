import { Request, Response } from "express";
import { Users } from "../models/Users";


export class UsersControllers {
    async list(req: Request, res: Response): Promise<Response> {
        let users: Users[] = await Users.find();

        return res.status(200).json(users);
    }

    async find(req: Request, res: Response): Promise<Response> {
        let user: Users = res.locals.user;

        return res.status(200).json(user);
    }

    async create(req: Request, res: Response): Promise<Response> {
        let body = req.body;

        let user: Users = await Users.create({
            name: body.name,
            email: body.email,
            password: body.password,
            phone: body.phone,
            CPF: body.cpf,
            address: body.address,
            situation: 'A'
        }).save();

        return res.status(200).json(user);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let user: Users = res.locals.user;

        user.name = body.name;
        user.email = body.email;
        user.password = body.password;
        user.phone = body.phone;
        user.CPF = body.cpf;
        user.address = body.address;
        user.situation = 'A';

        await user.save();

        return res.status(200).json(user);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let user: Users = res.locals.user;

        user.situation = 'I';

        await user.save();

        return res.status(200).json(user);
    }
}