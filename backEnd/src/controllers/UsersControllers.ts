import bcrypt from 'bcrypt';
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

        let password = await bcrypt.hash(body.password, 10);

        let user: Users = await Users.create({
            name: body.name,
            email: body.email,
            password: password,
            phone: body.phone,
            CPF: body.CPF,
            address: body.address,
            situation: 'Ativo'
        }).save();

        return res.status(200).json(user);
    }

    async update(req: Request, res: Response): Promise<Response> {
        let body = req.body;
        let user: Users = res.locals.user;

        

        user.name = body.name;
        user.email = body.email;
        user.phone = body.phone;
        user.CPF = body.CPF;
        user.address = body.address;
        user.situation = body.situation;

        if (body.password) {
            let password = await bcrypt.hash(body.password, 10);
            user.password = password;
        }
        

        await user.save()

        return res.status(200).json(user);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        let user: Users = res.locals.user;

        if (!user) {
            return res.status(200).json({ message: "Evento não encontrado" });
        }

        user.situation = 'Inativo';

        await user.save()

        return res.status(200).json(user);
    }
}