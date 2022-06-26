import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { IsArray, IsDefined, IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';
import { Ticket } from "../../ticket/ticket.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
		
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@Length(3,10, )
	@Prop({required: true})
	username: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@Prop({required: true})
	password: string;

	@IsArray()
	@IsNotEmpty()
	@Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}])
	assignedTicket: Ticket[]

	@Prop([{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}])
	writtenTicket: Ticket[]
}
export const UserSchema = SchemaFactory.createForClass(User);