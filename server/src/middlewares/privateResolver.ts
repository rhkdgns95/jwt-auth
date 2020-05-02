import { Context, Payload } from '../types/api';
import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';

/**
 *  Get bearer token
 *  1. Bearer Token값(accessToken)의 존재 유무.
 *  2. Token값의 만료기간 확인.
 *
 * @param param: Context를 가져옴.
 * @param next: 다음 미들웨어를 실행시킴.
 */
export const privateResolver: MiddlewareFn<Context> = async (
	{ context },
	next
) => {
	const { req } = context;
	const token: string | undefined = req.get('X-JID');
	if (token) {
		const accessToken: string | undefined = token.split(' ')[1];
		if (accessToken) {
			// Exist accessToken.
			const payload: Payload = verify(accessToken, process.env.JWT_ACCESS_SECRET || '') as Payload;

			if (payload && payload.userId) {
				// available AccessToken.
				context.payload = payload;
				// console.log('accessToken이 이용 가능함: ', payload);
			} else {
				console.log('accessToken의 기간이 만료됨');
				throw new Error('No authenticated');
			}
		} else {
			throw new Error('No authenticated');
		}
	} else {
		throw new Error('No authenticated');
	}
	return next();
};
