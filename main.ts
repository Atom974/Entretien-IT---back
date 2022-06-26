import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";

async function run() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	await app.listen(3942);
}
run();
