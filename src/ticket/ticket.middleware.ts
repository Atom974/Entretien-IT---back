import { HttpException, HttpStatus, Injectable, NestMiddleware, Param, Query } from "@nestjs/common";
import { Request, Response } from "express";
import { User, UserDocument } from "../user/schema/user.schema";
import { TicketDocument } from "./ticket.schema";
import { TicketService } from "./ticket.service";


@Injectable()
export class TicketMiddleware implements NestMiddleware {
	constructor(private readonly ticketService: TicketService) { }

	async use(req: Request & {user: UserDocument; ticket: TicketDocument}, res: Response, next: (error?: any) => void) {
		const ticketid = req.query.ticketid ?? req.params.ticketid;
		let ticket: TicketDocument;
		console.log(ticketid);
		try {
			const ticket = await this.ticketService.findById(ticketid.toString());
			if (!ticket)
				throw new Error();
			req.ticket = ticket;
		} catch (error) {
			throw new HttpException('Ticket not Found', HttpStatus.NOT_FOUND);
		}
		next();
	}
}