import { CreateSession } from "#types/login.type.js";
import { DBClient } from "#types/prisma.type.js";

export class SessionRepo {
  constructor(private db: DBClient) {}

  async createSession(data: CreateSession) {
    const session = await this.db.session.create({ data });
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
