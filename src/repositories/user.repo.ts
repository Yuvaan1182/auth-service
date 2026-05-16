import { DBClient } from "#types/prisma.type.js";

export class UserRepo {
  constructor(private db: DBClient) {}

  async findUserByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async createUser(data: { email: string; password: string; name: string }) {
    const user = await this.db.user.create({ data });
    return user;
  }
}
