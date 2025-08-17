import { NextApiRequest, NextApiResponse } from "next";
import { inngest } from "@/inngest/client";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Send your event payload to Inngest
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "testUser@example.com",
    },
  });

  res.status(200).json({ message: "Event sent!" });
}