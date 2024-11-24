import { db } from '@/lib/db';
import { User } from './type';

export const getUserByEmail = async (email: string, withPassword = false): Promise<User | null> => {
  const user = await db.readFirst<User>('SELECT * FROM users WHERE email = $1', [email]);
  if (!user) return null;
  if (!withPassword) delete user.password;
  return user;
};

export const createUser = async (email: string, password: string) => {
  await db.execute(
    `
	INSERT INTO users (
    email,
		password
	)
	VALUES (
		$1,
		$2
	)`,
    [email, password]
  );
};
