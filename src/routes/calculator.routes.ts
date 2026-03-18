import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateOTP, verifyOTP } from "../services/otp.service";
import { generateAIReport } from "../services/ai.service";
import { predictExpansionCost } from "../services/costPrediction.service";
import { generatePDF } from "../services/pdf.service";
import { resend } from "../services/email.service";
import { createLeadService } from "../services/lead.service";

export default async function calculatorRoutes(app: FastifyInstance) {

  /* ================= OTP SEND ================= */

  app.post("/calculator/send-otp", {
    config: {
      rateLimit: { max: 3, timeWindow: "5 minutes" },
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        return reply.status(400).send({ success: false, message: "Email required" });
      }

      const otp = await generateOTP(email);

      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email, //  FIXED (no hardcode)
        subject: "Your Verification Code",
        html: `<h1>${otp}</h1>`,
      });

      if (error) throw new Error("Email send failed");

      return { success: true };

    } catch (err) {
      req.log.error(err);
      return reply.status(500).send({ success: false, message: "OTP send failed" });
    }
  });

  /* ================= OTP VERIFY ================= */

  app.post("/calculator/verify-otp", async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, otp } = req.body as { email?: string; otp?: string };

    if (!email || !otp) {
      return reply.status(400).send({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const valid = await verifyOTP(email, otp);

    if (!valid) {
      return reply.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    return { success: true, verified: true };
  });

  /* ================= GENERATE REPORT ================= */

  app.post("/calculator/generate-report", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = req.body as any; //  ideally define a DTO later

      // 🔮 Prediction
      const prediction = await predictExpansionCost(data);

      // 🤖 AI report
      const aiText = await generateAIReport(data);

      // 💾 Save lead
      await createLeadService({
        ...data,
        estimatedMinCost: prediction.estimated_min_cost,
        estimatedMaxCost: prediction.estimated_max_cost,
        recommendedSetup: prediction.recommended_setup,
        aiReport: aiText,
      });

      // 📄 PDF
      const pdfBuffer = Buffer.from(generatePDF(data, aiText));

      /* ================= CLIENT EMAIL ================= */

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.email,
        subject: "Your AI KSA Expansion Report",
        html: `
          <h2>Your AI Expansion Report is Ready</h2>
          <p>Hello <b>${data.fullName}</b>,</p>
          <p>SAR ${prediction.estimated_min_cost} - SAR ${prediction.estimated_max_cost}</p>
        `,
        attachments: [
          {
            filename: "ksa-expansion-report.pdf",
            content: pdfBuffer,
          },
        ],
      });

      /* ================= OWNER EMAIL ================= */

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "info@blueweb2.com",
        subject: "New KSA Expansion Lead",
        html: `<p>New lead from ${data.fullName}</p>`,
      });

      return {
        success: true,
        prediction,
      };

    } catch (err) {
      req.log.error(err);

      return reply.status(500).send({
        success: false,
        message: err instanceof Error ? err.message : "Report generation failed",
      });
    }
  });

}