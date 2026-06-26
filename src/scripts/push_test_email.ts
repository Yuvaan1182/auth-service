import { emailQueue } from "#queue/email.queue.js";

async function run() {
  const job = await emailQueue.add(
    "send_verification_email",
    { email: "test@example.com", token: "sample-token-123" },
    { removeOnComplete: true },
  );
  console.log("Enqueued job id:", job.id);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
