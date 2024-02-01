import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RoleType {
    ADMIN = 'ADMIN',
    USER = 'USER'
}


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public declare id : number;

    @Column()
    public declare firstName : string;

    @Column()
    public declare lastName : string;

    @Column({
        type : 'enum',
        enum: Object.values(RoleType)
    })
    public declare role : RoleType;
}