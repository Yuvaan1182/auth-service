import { CreateSession } from "#types/login.type.js";
import { DBClient } from "#types/prisma.type.js";

export class SessionRepo {
  constructor(private db: DBClient) {}

  async createSession(data: CreateSession) {
    const session = await this.db.session.create({ data });
    return session;
  }

  async findSession(data: { sessionId: string }) {
    const session = await this.db.session.findUnique({
      where: {
        sessionId: data.sessionId,
      },
    });

    return session;
  }

  async rotateSession(data: { sessionId: string; tokenHash: string }) {
    const session = await this.db.session.update({
      where: {
        sessionId: data.sessionId,
      },
      data: {
        refreshTokenHash: data.tokenHash,
        lastUsedAt: new Date(),
      },
    });
  }

  async revokeSession(data: { sessionId: string }) {
    const session = await this.db.session.update({
      where: {
        sessionId: data.sessionId,
      },
      data: {
        revoked: true,
      },
    });

    return session;
  }
}
// model Session {
//   id String @id @default(uuid())
//   sessionId String

//   // ------------------------------------------
//   // RELATION
//   // ------------------------------------------

//   userId String
//   user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

//   // ------------------------------------------
//   // REFRESH TOKEN
//   // ------------------------------------------
//   //
//   // Store HASHED refresh token only
//   // Never store raw token
//   //
//   refreshTokenHash String

//   // ------------------------------------------
//   // DEVICE INFO
//   // ------------------------------------------

//   ipAddress String?

//   userAgent String? @db.Text

//   browser   String?
//   os        String?
//   device    String?

//   // ------------------------------------------
//   // SESSION STATE
//   // ------------------------------------------

//   revoked Boolean @default(false)

//   // optional reason
//   revokedReason String?

//   // ------------------------------------------
//   // EXPIRATION
//   // ------------------------------------------
//   expiresAt DateTime
//   // ------------------------------------------
//   // AUDIT
//   // ------------------------------------------
//   lastUsedAt DateTime @default(now())

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

// }
