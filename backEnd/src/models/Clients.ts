import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    // Acho que o nome da coluna precisa ser cpf em minúsculo, acho que como está aqui a coluna no banco ficará como
    @Column()
    CPF: string;

    // Acho que esse campo não é necessário
    @Column()
    address: string;

    // Qual seria a função desse campo?
    @Column()
    situation: string;

    @ManyToOne(() => Events, events => events.clients, { eager: true })
    @JoinColumn({ name: "client_id" })
    events: Events;
}