import { TokenPurpose } from "#prisma/enums.js";
import { DBClient } from "#types/prisma.type.js";

export class TokenRepo {
  constructor(private db: DBClient) {}

  async createToken(data: {
    tokenHash: string;
    purpose: TokenPurpose;
    userId: string;
    expiresAt: Date;
  }) {
    const token = await this.db.token.create({
      data: data,
    });
    return token;
  }

  async findTokenByUserIdAndPurpose(userId: string, purpose: TokenPurpose) {
    const token = await this.db.token.findFirst({
      where: {
        userId: userId,
        purpose: purpose,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        expiresAt: "desc",
      },
    });
    return token;
  }

  async updateTokenStatus(tokenId: string) {
    const token = await this.db.token.update({
      where: {
        id: tokenId,
      },
      data: {
        isUsed: true,
      },
    });

    return token;
  }
}
