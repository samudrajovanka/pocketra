import { db } from '../../config/db';
import { userProvidersTable, usersTable } from './auth.schema';
import type { AuthProvider, User } from './types';

export default class AuthRepository {
	async createUserWithProvider(
		userData: Pick<User, 'email' | 'name' | 'avatarUrl'>,
		providerData: { provider: AuthProvider; providerUserId: string },
	) {
		return db.transaction(async (tx) => {
			const [newUser] = await tx
				.insert(usersTable)
				.values({
					email: userData.email,
					name: userData.name,
					avatarUrl: userData.avatarUrl,
				})
				.returning();

			await tx.insert(userProvidersTable).values({
				provider: providerData.provider,
				providerUserId: providerData.providerUserId,
				userId: newUser.id,
			});

			return newUser;
		});
	}
}
