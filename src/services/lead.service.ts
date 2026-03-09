// import Lead from "../models/Lead.model";
// import { CreateLeadBody } from "../controllers/lead.controller";
// import { createError } from "../utils/errors";

// // small helper
// const clean = (v?: string) => (v || "").trim();

// export const createLeadService = async (body: CreateLeadBody) => {
//   const payload = {
//     fullName: clean(body.fullName),
//     email: clean(body.email).toLowerCase(),
//     mobile: clean(body.mobile),

//     investorType: clean(body.investorType),
//     activity: clean(body.activity),
//     city: clean(body.city),
//     timeline: clean(body.timeline),
//     visas: body.visas,

//     supports: {
//       bankSupport: Boolean(body.supports?.bankSupport),
//       accountingSupport: Boolean(body.supports?.accountingSupport),
//       vroSupport: Boolean(body.supports?.vroSupport),
//     },
//   };

//   // ✅ Optional: prevent duplicates (email OR mobile)
//   const exists = await Lead.findOne({
//     $or: [{ email: payload.email }, { mobile: payload.mobile }],
//   });

//   if (exists) {
//     throw createError(409, "Lead already exists");
//   }

//   const lead = await Lead.create(payload);
//   return lead;
// };

// // ✅ Add pagination (recommended)
// export const getLeadsService = async (page = 1, limit = 20) => {
//   const skip = (page - 1) * limit;

//   const leads = await Lead.find()
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .select("-__v"); // hide unwanted fields

//   const total = await Lead.countDocuments();

//   return {
//     leads,
//     page,
//     limit,
//     total,
//     totalPages: Math.ceil(total / limit),
//   };
// };
import Lead from "../models/Lead.model";

/*
CREATE LEAD
*/

export async function createLeadService(data: any) {
  return Lead.create(data);
}

/*
GET ALL LEADS
*/

export async function getLeadsService() {
  return Lead.find().sort({ createdAt: -1 });
}