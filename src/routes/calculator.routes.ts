import { FastifyInstance } from "fastify";
import { generateOTP, verifyOTP } from "../services/otp.service";
import { generateAIReport } from "../services/ai.service";
import { predictExpansionCost } from "../services/costPrediction.service";
import { generatePDF } from "../services/pdf.service";
import { resend } from "../services/email.service";
import { createLeadService } from "../services/lead.service";
export default async function calculatorRoutes(app: FastifyInstance) {

  /*
  =================================
  SEND OTP
  =================================
  */

  app.post(
    "/calculator/send-otp",
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: "5 minutes",
        },
      },
    },
    async (req: any, reply) => {
      try {

        const { email } = req.body;

        if (!email) {
          return reply.status(400).send({
            error: "Email required",
          });
        }

        const otp = await generateOTP(email);

  //       await resend.emails.send({
  //         from: "onboarding@resend.dev",
  //         to: email,
  //         subject: "Your Verification Code",
  //         html: `
  //   <h2>Your OTP Code</h2>
  //   <h1 style="letter-spacing:4px">${otp}</h1>
  //   <p>This code expires in 5 minutes.</p>
  // `,
  //       });
const { data: emailData, error } = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "info@blueweb2.com",
  subject: "Your Verification Code",
  html: `<h1>${otp}</h1>`
});

if (error) {
  console.error("Resend error:", error);
  throw new Error("Email send failed");
}

        return { success: true };

      } catch (err) {

        console.error(err);

        return reply.status(500).send({
          error: "OTP send failed",
        });

      }
    }
  );

  /*
  =================================
  VERIFY OTP
  =================================
  */

  app.post("/calculator/verify-otp", async (req: any, reply) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return reply.status(400).send({
        error: "Email and OTP are required"
      });
    }

    const valid = await verifyOTP(email, otp);

    if (!valid) {
      return reply.status(400).send({
        error: "Invalid OTP"
      });
    }

    return { verified: true };

  });

  /*
  =================================
  GENERATE REPORT
  =================================
  */

  app.post("/calculator/generate-report", async (req: any, reply) => {
    try {

      const data = req.body;

      /*
      ============================
      AI COST PREDICTION
      ============================
      */

      const prediction = await predictExpansionCost(data);
      console.log("Prediction:", prediction);

      /*
      ============================
      AI ADVISORY REPORT
      ============================
      */

      const aiText = await generateAIReport(data);

      /*
      ============================
      SAVE LEAD
      ============================
      */

      await createLeadService({
        ...data,
        estimatedMinCost: prediction.estimated_min_cost,
        estimatedMaxCost: prediction.estimated_max_cost,
        recommendedSetup: prediction.recommended_setup,
        aiReport: aiText,
      });

      /*
      ============================
      GENERATE PDF
      ============================
      */

      const pdfBuffer = Buffer.from(generatePDF(data, aiText));

      /*
      ============================
      CLIENT EMAIL
      ============================
      */

      const clientHtml = `
      <h2>Your AI Expansion Report is Ready</h2>

      <p>Hello <b>${data.fullName}</b>,</p>

      <p>
      Based on your inputs, our AI advisor has generated your
      Saudi Arabia expansion strategy report.
      </p>

      <h3>Estimated Setup Cost</h3>

      <p>
      SAR ${prediction.estimated_min_cost} -
      SAR ${prediction.estimated_max_cost}
      </p>

      <h3>Recommended Setup</h3>

      <p>${prediction.recommended_setup}</p>

      <p>Your detailed report is attached as a PDF.</p>

      <br>

      <b>Nishad Gateway</b>
      `;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        // to: data.email,
        to: "info@blueweb2.com",
        subject: "Your AI KSA Expansion Report",
        html: clientHtml,
        attachments: [
          {
            filename: "ksa-expansion-report.pdf",
            content: pdfBuffer,
          },
        ],
      });

      /*
      ============================
      OWNER EMAIL
      ============================
      */

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "info@blueweb2.com",
        subject: "New KSA Expansion Lead",
        html: `
        <h2>New Lead Received</h2>

        <p><b>Name:</b> ${data.fullName}</p>
        <p><b>Email:</b> info@blueweb2.com</p>
        <p><b>Mobile:</b> ${data.mobile}</p>

        <hr/>

        <p><b>Investor Type:</b> ${data.investorType}</p>
        <p><b>Activity:</b> ${data.activity}</p>
        <p><b>City:</b> ${data.city}</p>
        <p><b>Timeline:</b> ${data.timeline}</p>
        <p><b>Visas:</b> ${data.visas}</p>

        <hr/>

        <p><b>Estimated Cost</b></p>

        <p>
        SAR ${prediction.estimated_min_cost}
        -
        SAR ${prediction.estimated_max_cost}
        </p>
        `,
      });

      return {
        success: true,
        prediction,
      };

    } catch (err) {

      console.error(err);

      return reply.status(500).send({
        error: "Report generation failed",
      });

    }
  });

}