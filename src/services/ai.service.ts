import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIReport(data: any) {

  // MOCK AI (development)
  if (process.env.NODE_ENV === "development") {

    return `
KSA Business Expansion Advisory Report

Client: ${data.fullName}

Saudi Arabia is encouraging foreign investment in sectors like ${data.activity}.
${data.city} offers strong infrastructure and commercial opportunities.

Recommended Setup
Limited Liability Company (LLC)

Estimated Cost
SAR 35,000 – SAR 50,000

Strategic Advice
Starting with ${data.visas} visas allows gradual expansion.
`;
  }

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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

  } catch (err) {

    console.error("Gemini error:", err);

    // fallback AI
    return `
KSA Business Expansion Advisory Report

Client: ${data.fullName}

Based on your inputs (${data.activity} in ${data.city}),
Saudi Arabia offers strong opportunities for expansion.

Recommended Setup
Limited Liability Company (LLC)

Estimated Cost Range
SAR 35,000 – SAR 50,000

Strategic Advice
Start with ${data.visas} visas and scale gradually.
`;
  }
}