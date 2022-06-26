import { Body, Controller, Post, Put, Req, Get, HttpCode, Delete } from "@nestjs/common";
import { Request } from "express";
import { IPayload } from "../user/auth.middleware";
import { User, UserDocument } from "../user/schema/user.schema";
import { Ticket, TicketDocument } from "./ticket.schema";
import { TicketService } from "./ticket.service";

@Controller('ticket')
export class TicketController {
	constructor(
		private readonly ticketService: TicketService
	) {}
	
	@Post()
	async create(@Req() request : Request & {user: UserDocument}, @Body() createTicketDto: Partial<Ticket>): Promise<Ticket> {
		return await this.ticketService.create(createTicketDto, request.user);
	}
	@Get()
	async findAll() {
		return await this.ticketService.findAll();
	}

	@Put(':ticketid')
	async update(@Req() request: Request & {user: UserDocument; ticket: TicketDocument} , @Body() updateTicketDto: Partial<Ticket>) {
		return await this.ticketService.update(updateTicketDto, request.user, request.ticket)
	}

	@Delete(':ticketid')
	@HttpCode(204)
	async delete(@Req() request: Request & {user: UserDocument; ticket: TicketDocument}) {
		return await this.ticketService.delete(request.ticket._id);
	}

}