import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule, Schema } from "@nestjs/mongoose";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { TicketController } from "./ticket.controller";
import { TicketMiddleware } from "./ticket.middleware";
import { Ticket, TicketSchema } from "./ticket.schema";
import { TicketService } from "./ticket.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
		UserModule,
	],
	controllers: [TicketController],
	providers: [TicketService, UserService],
	exports: [MongooseModule]
})
export class TicketModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(TicketController)
			.apply(TicketMiddleware)
			.forRoutes(
				{ path: 'ticket/:ticketid', method: RequestMethod.PUT },
				{ path: 'ticket/:ticketid', method: RequestMethod.DELETE }
			)
	}
}