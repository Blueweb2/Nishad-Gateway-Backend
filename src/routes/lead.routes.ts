import { FastifyInstance } from "fastify";
import Lead from "../models/Lead.model";

type CreateLeadBody = {
  fullName: string;
  email: string;
  mobile: string;

  investorType: string;
  activity: string;
  city: string;
  timeline: string;
  visas: number;

  supports: {
    bankSupport: boolean;
    accountingSupport: boolean;
    vroSupport: boolean;
  };

  estimate: {
    min: number;
    max: number;
    timelineText: string;
    recommendedSetup: string;
    suggestedCity: string;
  };

  aiReply?: string;
  source?: string;

  // ✅ correct type
  status?: "new" | "contacted" | "converted";
};
console.log("✅ leadRoutes loaded");


export default async function leadRoutes(app: FastifyInstance) {
  // ✅ Create Lead
  app.post<{ Body: CreateLeadBody }>("/leads", async (request, reply) => {
    try {
      const lead = await Lead.create(request.body);
      return reply.code(201).send({ success: true, lead });
    } catch (err) {
      console.log(err);
      return reply
        .code(500)
        .send({ success: false, message: "Lead save failed" });
    }
  });

  // ✅ Get Leads (Admin)
  app.get("/leads", async (_request, reply) => {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      return reply.send({ success: true, leads });
    } catch (err) {
      console.log(err);
      return reply
        .code(500)
        .send({ success: false, message: "Lead fetch failed" });
    }
  });

  // ✅ Update Lead Status
  app.patch<{
    Params: { id: string };
    Body: { status: "new" | "contacted" | "converted" };
  }>("/leads/:id/status", async (request, reply) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

      return reply.send({ success: true, lead });
    } catch (err) {
      console.log(err);
      return reply
        .code(500)
        .send({ success: false, message: "Status update failed" });
    }
  });
}
