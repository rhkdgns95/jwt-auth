import { sign } from 'jsonwebtoken';
import { User } from './entity/User';

export const createAccessToken = (user: User): string => {
	const accessToken: string = sign(
		{ userId: user.id },
		process.env.JWT_ACCESS_SECRET || '',
		{
			expiresIn: '15m',
		}
	);
	return accessToken;
};

export const createRefreshToken = (user: User) => {
  const refreshToken: string = sign(
		{
			userId: user.id,
		},
		process.env.JWT_REFRESH_SECRET || '',
		{
			expiresIn: '1d',
		}
  );
  return refreshToken;
};
