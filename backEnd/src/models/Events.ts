import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    situation: string;
    
    @ManyToOne(() => Users, user => user.events, { eager: true })
    @JoinColumn({ name: "user_id" })
    user: Users;

    @OneToMany(() => Clients, clients => clients.events, { eager: true })
    @JoinColumn({ name: "clients_id" })
    clients: Clients[];
}