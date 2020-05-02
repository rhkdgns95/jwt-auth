import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { compareSync } from 'bcryptjs';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column('text', { unique: true })
	@IsEmail() // 동작하지 않음.
	email: string;

	@Field()
	@Column('text')
	password: string;

	@Field()
	@Column('int', { default: 0 })
	tokenVersion: number;

	comparePassword = (password: string): boolean => {
		const valid: boolean = compareSync(password, this.password);
		return valid;
	};

	@Field()
	@CreateDateColumn()
	createdAt: string;

	@Field()
	@UpdateDateColumn()
	updatedAt: string;
}
