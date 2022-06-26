import { HttpException, HttpStatus, Injectable, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Ticket, TicketDocument } from "./ticket.schema";
import { Model } from "mongoose";
import { validate } from "class-validator";
import { User, UserDocument } from "../user/schema/user.schema";


@Injectable()
export class TicketService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
	) { }

	async validDto(ticketDto: Partial<Ticket>, skip:boolean): Promise<Ticket> {
		const newTicket = new Ticket();
		newTicket.title = ticketDto.title;
		newTicket.description = ticketDto.description;
		newTicket.tags = ticketDto.tags;
		newTicket.assignedTo = ticketDto.assignedTo;
		newTicket.author = ticketDto.author;
		newTicket.endingDate = ticketDto.endingDate;
		newTicket.ux = ticketDto.ux;
		newTicket.design = ticketDto.design;
		newTicket.front = ticketDto.front;
		newTicket.back = ticketDto.back;
		newTicket.status = ticketDto.status;
		newTicket.teamRequirement = ticketDto.teamRequirement;
		newTicket.clientRequirement = ticketDto.clientRequirement;
		newTicket.lockDependency = ticketDto.lockDependency;
		const error = await validate(newTicket, {skipUndefinedProperties: skip, forbidUnknownValues: true});
		if (error.length != 0)
			throw new HttpException(error, HttpStatus.BAD_REQUEST);
		return newTicket;
	}

	async create(createTicketDto: Partial<Ticket>, user: UserDocument): Promise<Ticket> {
		let ticket: Ticket;
		try {
			createTicketDto.author = user;
			createTicketDto.status = 0;
			createTicketDto.assignedTo = [];
			ticket = await this.validDto(createTicketDto, false);
		} catch (error) {
			throw error;
		}
		const newTicket = new this.ticketModel(ticket);
		newTicket.save();
		return;
	}

	async update(updateTicketDto: Partial<Ticket>, user: User, currentTicketState: TicketDocument) {
		try {
			await this.validDto(updateTicketDto, true);
			await this.ticketModel.findByIdAndUpdate(currentTicketState._id, updateTicketDto);
			return await this.ticketModel.findById(currentTicketState._id).populate('assignedTo', '-password').populate('author', '-password').exec();
		} catch (error) {
			throw error;
		}
	}
	async delete(id: string){
		return await this.ticketModel.findByIdAndDelete(id);
	}

	async findById(ticketId: string): Promise<TicketDocument> {
		return await this.ticketModel.findById(ticketId);
	}
	async findAll(): Promise<Array<TicketDocument>> {
		return await this.ticketModel.find().populate('assignedTo', '-password').populate('author', '-password').exec();
	}
}