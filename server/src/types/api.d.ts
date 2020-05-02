import { Request, Response } from 'express';

interface Context {
	req: Request;
	res: Response;
	payload: Payload;
}
interface Payload {
	userId?: number;
	tokenVersion: number;
}
