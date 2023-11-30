import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./Events";

// Creio que o nome correto seria customers 
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

    @ManyToMany(() => Events, events => events.clients)
    @JoinColumn({ name: "client_id" })
    events: Events[];

    @ManyToMany(() => Events, events => events.clients)
    @JoinColumn({ name: "client_id" })
    presence: Events[];
}