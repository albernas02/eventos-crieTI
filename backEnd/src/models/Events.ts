import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from "./Clients";


@Entity('events')
export class Events extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    description: string;

    @Column({ type: "timestamp" })
    startDate: Date;

    @Column({ type: "timestamp" })
    endDate: Date;

    @Column()
    situation: string;

    @ManyToOne(() => Users, user => user.events)
    @JoinColumn({ name: "user_id" })
    user: Users;

    @ManyToMany(() => Clients)
    @JoinTable()
    clients: Clients[];

    @ManyToMany(() => Clients)
    @JoinTable()
    clientsPresence: Clients[];
}
