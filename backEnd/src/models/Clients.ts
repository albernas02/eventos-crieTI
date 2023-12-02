import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./Events";
import { Tickets } from "./Tickets";

@Entity('clients')
export class Clients extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    CPF: string;

    @Column()
    address: string;

    @Column()
    situation: string;


    @OneToMany(() => Tickets, ticket => ticket.client)
    tickets: Tickets[];
}