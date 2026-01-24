import { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../utils/response";

import { createLeadService, getLeadsService } from "../services/lead.service";

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
    const lead = await createLeadService(request.body);

    return sendResponse(reply, 201, true, "Lead created", lead);
  } catch (error: any) {
    request.log.error(error);
    return sendResponse(
      reply,
      error.statusCode || 500,
      false,
      error.message || "Lead save failed",
      null
    );
  }
};

export const getLeadsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const leads = await getLeadsService();

    return sendResponse(reply, 200, true, "Leads fetched", leads);
  } catch (error: any) {
    request.log.error(error);
    return sendResponse(
      reply,
      error.statusCode || 500,
      false,
      error.message || "Lead fetch failed",
      null
    );
  }
};
