import { AccountEntity, UserEntity } from "#imports";
import { eq, not, and, count, or, ilike } from "drizzle-orm";

export type UserList = Array<UserEntity>

export interface IUserRepository {
	findAll(pagination: { page: number | undefined, perPage: number | undefined }): Promise<UserList>

	findBy(by: 'email' | 'uid', emailOrUID: string): Promise<UserEntity | null>

	find(searchString: string, pagination: { page: number | undefined, perPage: number | undefined }): Promise<UserList | null>

	count(searchParam?: string): Promise<number>

	save(userEntity: UserEntity): Promise<UserEntity>

	removeBy(by: 'id' | 'uid', id: number | string): Promise<void>
}

export class UserRepository implements IUserRepository {
	async findAll(
		pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
	) {
		const isPaginationSetted = pagination.page && pagination.perPage
		const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

		return (await db.query.usersTable.findMany({
			offset: offset,
			limit: pagination.perPage,
			where: not(eq(usersTable.role, 'admin')),
			orderBy: (userList, { desc }) => [desc(userList.id)]
		})).map(item => new UserEntity(item))
	}

	async findBy(by: 'email' | 'uid', emailOrUID: string) {
		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable[by], emailOrUID)
		})
		if (!user)
			return null

		return new UserEntity(user)
	}

	async find(
		searchString: string,
		pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
	) {
		const isPaginationSetted = pagination.page && pagination.perPage
		const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

		return await db.query.usersTable.findMany({
			offset: offset,
			limit: pagination.perPage || 30,
			where: and(
				or(
					ilike(usersTable.name, `%${searchString}%`),
					ilike(usersTable.email, `%${searchString}%`),
				),
				not(eq(usersTable.role, 'admin'))
			),
			orderBy: (userList, { desc }) => [desc(userList.id)]
		})
	}

	async count(searchParam?: string) {
		const [total] = await db.select({ count: count() }).from(usersTable).where(
			and(
				searchParam ? or(
					ilike(usersTable.name, `%${searchParam}%`),
					ilike(usersTable.email, `%${searchParam}%`),
				) : undefined,
				not(eq(usersTable.role, 'admin'))
			),
		)
		return total.count
	}

	async save(userEntity: UserEntity) {
		if (userEntity.id) {
			const [updated] = await db.update(usersTable)
				.set({ role: userEntity.role })
				.where(eq(usersTable.id, userEntity.id)).returning()

			userEntity = Object.assign(updated)
		} else {
			const [inserted] = await db.insert(usersTable).values({
				name: userEntity.name,
				email: userEntity.email,
				role: userEntity.role
			}).returning()

			userEntity = Object.assign(inserted)
		}

		return userEntity
	}

	async removeBy(by: 'id' | 'uid', id: number | string) {
		await db.delete(usersTable).where(eq(usersTable[by], id))
	}
}


export type AccountList = Array<AccountEntity>

export interface IAccountRepository {
	findAllForUser(id: number): Promise<AccountList>

	findBy(by: 'id' | 'userId' | 'provider', column: number | { provider: string, providerAccountId: string }): Promise<AccountEntity | null>

	countForUser(id: number): Promise<number>

	save(accountEntity: AccountEntity): Promise<AccountEntity>

	removeBy(by: 'id' | 'userId', id: number): Promise<void>
}

export class AccountRepository implements IAccountRepository {
	async findAllForUser(id: number) {
		return (await db.query.accountsTable.findMany({
			where: eq(accountsTable.userId, id),
			orderBy: (table, { desc }) => [desc(table.id)]
		})).map(item => new AccountEntity(item))
	}

	async findBy(by: 'id' | 'userId' | 'provider', column: number | { provider: string, providerAccountId: string }) {
		const account = await db.query.accountsTable.findFirst({
			where: by === 'provider' && typeof column === 'object'
				? and(
					eq(accountsTable.provider, column.provider),
					eq(accountsTable.providerAccountId, column.providerAccountId)
				)
				: eq(accountsTable[by], column as number)
		})
		if (!account)
			return null

		return new AccountEntity(account)
	}

	async countForUser(id: number) {
		const [total] = await db.select({ count: count() }).from(accountsTable).where(eq(accountsTable.id, id))
		return total.count
	}

	async save(accountEntity: AccountEntity) {
		if (accountEntity.id) {
			// const [updated] = await db.update(accountsTable)
			// 	.set({})
			// 	.where(eq(accountsTable.id, accountEntity.id))
			// 	.returning()

			// accountEntity = Object.assign(updated)
		} else {
			const [inserted] = await db.insert(accountsTable).values({
				userId: accountEntity.userId,
				provider: accountEntity.provider,
				providerAccountId: accountEntity.providerAccountId,
			}).returning()

			accountEntity = Object.assign(inserted)
		}

		return accountEntity
	}

	async removeBy(by: 'id' | 'userId', id: number) {
		await db.delete(accountsTable).where(eq(accountsTable[by], id))
	}
}