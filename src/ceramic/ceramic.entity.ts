import { Entity, Column, Index, UpdateDateColumn, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class UserSession {

  @PrimaryColumn()
  @Index()
  hash: string;

  @Column()
  @Index()
  userId: number;

  @Column()
  @Index()
  guildId: number;

  @Column()
  @Index()
  address: string;

  @Column()
  session: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
