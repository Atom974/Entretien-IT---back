import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { AuthMiddleware } from "./auth.middleware";

@Module({
	imports: [
		MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [MongooseModule]
})
export class UserModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{path: 'users', method: RequestMethod.GET},
				{path: 'user', method: RequestMethod.POST},
				{path: 'users/auth', method: RequestMethod.GET},
				{path: 'users/:username', method: RequestMethod.GET}
				)
	}
}