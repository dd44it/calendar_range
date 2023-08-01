import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateRow } from '../utils/dateHelpers'

@Entity()
export class Date implements DateRow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date_start!: string;

  @Column()
  date_end!: string;
}
