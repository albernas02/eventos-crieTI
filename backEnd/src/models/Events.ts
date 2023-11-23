import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from "./Clients";


@Entity('events')
export class Events {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    desciption: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => Users, user => user.events, { eager: true })
    @JoinColumn({ name: "user_id" })
    user: Users;

    @OneToMany(() => Clients, clients => clients.events, { eager: true })
    @JoinColumn({ name: "clients_id" })
    clients: Clients[];
}