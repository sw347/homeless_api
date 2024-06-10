import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from "../../tag/dto/tag.dto";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  organization: string;

  @Column()
  phone: string;

  @Column({type: 'timestamp'})
  birth: Date;

  @Column()
  role: string;

  @Column()
  idle: string;

  @Column('simple-array')
  interest: string[];

  @Column()
  tags: Tag[];
}
