import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clients } from "./Clients";
import { Events } from "./Events";

@Entity('tickets')
export class Tickets extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Clients, client => client.tickets, { eager: true })
    @JoinColumn({ name: "Clients" })
    client: Clients

    @ManyToOne(() => Events, event => event.tickets, { eager: true })
    @JoinColumn()
    event: Events

    @Column({ nullable: true })
    presence: boolean;
}