import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "crypto";
import { NextFunction, Request, Response } from "express";
import { Interface } from "readline";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";

export interface IPayload {
	userid: string
	username: string
	date: Date
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) { }

	async use(req: Request & {user: User}, res: Response, next:NextFunction) {
		const authorizationHeader = req.headers.authorization;
		if (authorizationHeader == undefined)
			throw new HttpException('You\'re not authorized', HttpStatus.UNAUTHORIZED);
		try {
			const user = await this.userService.verifyToken(authorizationHeader);
			req.user = user;
			next();
		} catch (error) {
			throw new HttpException('Token Invalid', HttpStatus.UNAUTHORIZED);
		}
	}
}