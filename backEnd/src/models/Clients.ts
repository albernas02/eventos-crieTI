import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./Events";

@Entity('clients')
export class Clients {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    CPF: string;

    @Column()
    address: string;

    @Column()
    situation: string;

    @ManyToOne(() => Events, events => events.clients, { eager: true })
    @JoinColumn({ name: "client_id" })
    events: Events;
}