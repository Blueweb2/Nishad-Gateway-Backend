import { FastifyReply, FastifyRequest } from "fastify";
import Lead from "../models/Lead.model";

export type CreateLeadBody = {
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
};

export const createLeadController = async (
  request: FastifyRequest<{ Body: CreateLeadBody }>,
  reply: FastifyReply
) => {
  try {
    const lead = await Lead.create(request.body);
    return reply.code(201).send({ success: true, lead });
  } catch (error) {
    console.log(error);
    return reply
      .code(500)
      .send({ success: false, message: "Lead save failed" });
  }
};

export const getLeadsController = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return reply.send({ success: true, leads });
  } catch (error) {
    console.log(error);
    return reply
      .code(500)
      .send({ success: false, message: "Lead fetch failed" });
  }
};
