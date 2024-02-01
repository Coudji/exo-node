import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sound {
    @PrimaryGeneratedColumn()
    public declare id : number;

    @Column({
        length: 64,
        unique: true
    })
    public declare name : string;

    @Column()
    public declare category : string;

    @Column()
    public declare file : string;
}