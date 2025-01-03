import { UserEntity } from "#imports";
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
	protected readonly userListObject = {
		sketches: {
			columns: {
				id: true,
				status: true,
				thumbnail: true
			}
		},
		beginnerForms: {
			columns: {
				id: true
			}
		},
		clientForms: {
			columns: {
				id: true
			}
		}
	} as const

	async findAll(
		pagination: { page: number | undefined, perPage: number | undefined } = { page: undefined, perPage: undefined }
	) {
		const isPaginationSetted = pagination.page && pagination.perPage
		const offset = isPaginationSetted && (pagination.page! - 1) * pagination.perPage!

		return await db.query.usersTable.findMany({
			offset: offset,
			limit: pagination.perPage,
			where: not(eq(usersTable.role, 'admin')),
			with: this.userListObject,
			orderBy: (userList, { desc }) => [desc(userList.id)]
		})
	}

	async findBy(by: 'email' | 'uid', emailOrUID: string): Promise<UserEntity | null> {
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
			with: this.userListObject,
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
			await db.update(usersTable)
				.set({
					role: userEntity.role
				})
				.where(eq(usersTable.id, userEntity.id));
		} else {
			const [inserted] = await db.insert(usersTable).values({
				name: userEntity.name,
				email: userEntity.email,
				uid: userEntity.uid,
				role: userEntity.role,
			}).returning({ id: usersTable.id })

			userEntity.id = inserted.id
		}

		return userEntity
	}

	async removeBy(by: 'id' | 'uid', id: number | string) {
		await db.delete(usersTable).where(eq(usersTable[by], id))
	}
}