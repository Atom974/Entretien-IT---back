import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { validate } from "class-validator";
import { hashPassword, isPasswordMatch } from "../utils/password.util";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { IPayload } from "./auth.middleware";
import { unwatchFile } from "fs";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectConnection() private connection: Connection
	) { }
	private readonly JWT_PRIVATE_KEY = "MY_PRIVATE_KEY";

	public async create(createUserDto: Partial<User>): Promise<User> {
		const newUser = new User();
		newUser.username = createUserDto.username;
		newUser.password = createUserDto.password;
		newUser.assignedTicket = [];
		const error = await validate(newUser);
		if (error.length != 0)
			throw new HttpException(error, HttpStatus.BAD_REQUEST)
		const existingUser = await this.userModel.exists({ username: createUserDto.username })
		if (existingUser != null)
			throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'This username already taken' }, HttpStatus.FORBIDDEN)
		const createdUser = new this.userModel(newUser);
		createdUser.password = hashPassword(createdUser.password);
		createdUser.save();
		return 
	}

	public async connect(connectUserDto: Partial<User>): Promise<UserDocument> {
		console.log(connectUserDto);
		const user = new User();
		user.username = connectUserDto.username;
		user.password = connectUserDto.password;
		user.assignedTicket = [];
		let error = await validate(user);
		if (error.length != 0)
			throw new HttpException(error, HttpStatus.BAD_REQUEST)
		const existingUser = await this.userModel.findOne({ username: user.username })
		if (!existingUser)
			throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'utilisateur inconnu' }, HttpStatus.FORBIDDEN)
		if (!isPasswordMatch(existingUser.password, user.password))
			throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Password not correct' }, HttpStatus.FORBIDDEN)
		return existingUser;
	}
	public async verifyToken(token: string): Promise<User> {
		try {
			const payload: IPayload = this.decode(token);
			return await this.userModel.findById(payload.userid).exec();
		} catch (error) {
			throw error;
		}
	}

	public encode(payload: Object): string {
		return sign(payload, this.JWT_PRIVATE_KEY, { expiresIn: "1 day" });
	}
	private decode(token: string): any {
		return verify(token, this.JWT_PRIVATE_KEY);
	}
	public showUsers(query: string):Promise<Array<User>> {
		return this.userModel.find({username: {$regex: '.*' + query + '.*'}}).limit(10).exec();
	}

	async findAll(): Promise<User[]> {
		return this.userModel
			.find()
			//.populate('writtenTicket')
			//.populate('assignedTicket')
			.exec();
	}
}