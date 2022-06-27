import mongoose, { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { User } from '../user/schema/user.schema'
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, Max, Min } from "class-validator";

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
	@IsNotEmpty()
	@Prop()
	title: string;

	@IsNotEmpty()
	@Prop()
	description: string;

	@Prop()
	tags: Array<string>;

	@IsArray()
	@Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'User'}])
	assignedTo: User[];

	@IsNotEmpty()
	@Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
	author: User

	@Prop()
	endingDate: Date;

	@IsNotEmpty()
	@IsNumber()
	@Prop()
	ux: number;

	@IsNotEmpty()
	@IsNumber()
	@Prop()
	design: number;

	@IsNotEmpty()
	@IsNumber()
	@Prop()
	front: number;

	@IsNotEmpty()
	@IsNumber()
	@Prop()
	back: number;

	@IsNotEmpty()
	@IsNumber()
	@Max(1)
	@Min(0)
	@Prop()
	teamRequirement: number;

	@IsNotEmpty()
	@IsNumber()
	@Max(1)
	@Min(0)
	@Prop()
	clientRequirement: number;

	@IsNotEmpty()
	@IsNumber()
	@Max(1)
	@Min(0)
	@Prop()
	lockDependency : number;

	@IsNotEmpty()
	@IsNumber()
	@Max(5)
	@Min(0)
	@Prop()
	status: number
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);