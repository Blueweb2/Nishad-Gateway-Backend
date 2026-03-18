import { FastifyReply, FastifyRequest } from "fastify";
import { resend } from "../services/email.service";

interface ContactBody {
  name: string;
  phone: string;
  email: string;
  service: string;
  serviceName: string;
  city: string;
}

export const sendContactEmail = async (
  request: FastifyRequest<{ Body: ContactBody }>,
  reply: FastifyReply
) => {
  try {
    const { name, phone, email, serviceName, city } = request.body;

    await resend.emails.send({
      from: "Nishad Gateway <onboarding@resend.dev>",
      to: ["info@blueweb2.com"],
      subject: "New Contact Request",
      html: `
        <h2>New Contact Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>City:</strong> ${city}</p>
      `,
    });

    return reply.send({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    return reply.status(500).send({ success: false });
  }
};