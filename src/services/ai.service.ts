import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIReport(data: any) {

  // ✅ MOCK AI for development
  if (process.env.NODE_ENV === "development") {

    return `
KSA Business Expansion Advisory Report

Client: ${data.fullName}

Expansion Overview
Saudi Arabia is actively encouraging foreign investment in sectors such as ${data.activity}. ${data.city} is a strategic location with strong infrastructure and commercial opportunities.

Recommended Company Structure
A Limited Liability Company (LLC) is typically recommended for ${data.investorType} investors entering the Saudi market.

Estimated Setup Cost
Based on your inputs, the estimated setup cost ranges between SAR 35,000 – SAR 50,000 depending on licensing, visa processing and compliance requirements.

Compliance Requirements
• Commercial Registration
• Ministry of Investment approval
• Municipality license
• ZATCA tax registration

Strategic Advice
Starting operations in ${data.city} with ${data.visas} visas allows gradual expansion while maintaining manageable operational costs.
`;
  }

  // 🚀 REAL AI (production only)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
  });

  const prompt = `
You are a Saudi Arabia business expansion consultant.

Client:
Name: ${data.fullName}
Investor Type: ${data.investorType}
Business Activity: ${data.activity}
City: ${data.city}
Visas: ${data.visas}
Timeline: ${data.timeline}

Create a professional advisory report including:

1. Expansion overview
2. Recommended company structure
3. Estimated setup cost
4. Compliance requirements
5. Strategic advice
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}