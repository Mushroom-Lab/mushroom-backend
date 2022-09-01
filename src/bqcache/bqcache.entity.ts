import { Entity, Column, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class BqCache {

  @PrimaryColumn()
  @Index()
  hash: string;

  @Column()
  sql: string;

  @Column()
  result: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
