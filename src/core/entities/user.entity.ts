import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToMany } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { Organisation } from './organization.entity';

@Entity()
@Unique(['userId', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  firstName: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  lastName: string;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToMany(() => Organisation, organisation => organisation.users)
  organisations: Organisation[];

}
