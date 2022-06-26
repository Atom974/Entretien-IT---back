import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { TicketModule } from "./ticket/ticket.module";

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://localhost/nest'),
		UserModule,
		TicketModule
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}