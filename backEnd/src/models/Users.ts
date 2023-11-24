import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Events } from "./Events";

@Entity('users')
export class Users extends BaseEntity {
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

    @OneToMany(() => Events, event => event.user)
    events: Events[];
}