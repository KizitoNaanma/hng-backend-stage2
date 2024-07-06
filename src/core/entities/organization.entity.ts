import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column({ nullable: false })
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToMany(() => User, user => user.organisations)
  @JoinTable()
  users: User[];
}