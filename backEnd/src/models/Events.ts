import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from "./Clients";


@Entity('events')
export class Events extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    description: string;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    situation: string;

    @ManyToOne(() => Users, user => user.events)
    @JoinColumn({ name: "user_id" })
    user: Users;

    @ManyToMany(() => Clients, clients => clients.events)
    @JoinColumn({ name: "clients_id" })
    clients: Clients[];
}