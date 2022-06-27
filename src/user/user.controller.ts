import { Body, Controller, Get, HttpCode, Param, Post, Req, Res } from "@nestjs/common";
import { Request, response, Response} from "express";
import { User, UserDocument } from "./schema/user.schema";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService
	) {}
	
	@Post()
	@HttpCode(204)
	async create(@Body() createUserDto: Partial<User>): Promise<User> {
		const createdUser = await this.userService.create(createUserDto);
		return createdUser;
	}

	@Post('connect')
	async connect(@Body() connectUserDto: Partial<User>): Promise<Object> {
		const user = await this.userService.connect(connectUserDto);
		const token = this.userService.encode({
			userid: user._id,
			username: user.username,
			date: new Date()
		})
		let {password, ...newUser} = user.toJSON();
		return {newUser, token};
	} 
	@Get()
	async findAll(@Req() request: Request): Promise<Array<User>> {
		console.log('get');
		return this.userService.findAll();
	}
	@Get('auth')
	isAuth(): boolean {
		return true;
	}
	@Get(':username')
	find(@Req() req: Request){
		const username = req.query.username ?? req.params.username;
		return this.userService.showUsers(username.toString());
	}
}