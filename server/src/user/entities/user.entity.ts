import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'char', length: 12 })
  id: string;

  @Column({ type: 'char', length: 50, unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'char', length: 50, nullable: true })
  @Index()
  name: string;

  @Column({ type: 'char', length: 20, nullable: true })
  @Index()
  mobile: string;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
