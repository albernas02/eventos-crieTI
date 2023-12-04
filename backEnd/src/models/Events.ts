import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";
import { Clients } from "./Clients";
import { Tickets } from "./Tickets";


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

    @Column()
    price: string;

    @Column({ type: "timestamp" })
    startDate: Date;

    @Column({ type: "timestamp" })
    endDate: Date;

    @Column()
    situation: string;

    @Column({nullable: true, length: 1000 })
    imgUrl: string;

    @ManyToOne(() => Users, user => user.events, { eager: true })
    @JoinColumn({ name: "user_id" })
    user: Users;

    @OneToMany(() => Tickets, ticket => ticket.event)
    tickets: Tickets[];
}
