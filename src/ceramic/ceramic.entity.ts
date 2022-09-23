import { Entity, Column, Index, UpdateDateColumn, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class UserSession {

  @PrimaryColumn()
  @Index()
  hash: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  guildId: string;

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
