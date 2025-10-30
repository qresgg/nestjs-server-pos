import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    role: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'date'})
    dateOfBirth: Date;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ unique: true})
    code: string;

    @Column({ type: 'varchar', length: 11, unique: true })
    ssn: string

    @Column()
    email: string;

    @Column({ type: 'varchar', length: 11 })
    phone: string;

    @Column({ name: 'refreshHash', type: 'text', nullable: true })
    refreshHash: string | null;
}