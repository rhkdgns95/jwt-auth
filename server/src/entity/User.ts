import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Field } from 'type-graphql';

@Entity('users')
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column('text', { unique: true })
	email: string;

	@Field()
	@Column('text')
	password: string;

	@Field()
	@CreateDateColumn()
	createdAt: string;

	@Field()
	@UpdateDateColumn()
	updatedAt: string;
}
