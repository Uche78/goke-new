"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const REASON_LABELS: Record<string, string> = {
  support: "Individual Support",
  demo: "Demo Request",
  partnership: "Partnership Inquiry",
  other: "Other",
};

export async function sendContactEmail(data: {
  name: string;
  email: string;
  reason: string;
  message: string;
}) {
  const reasonLabel = REASON_LABELS[data.reason] ?? data.reason;

  const { error } = await resend.emails.send({
    from: "Goke Contact Form <onboarding@resend.dev>",
    to: "prdtools78@gmail.com",
    replyTo: data.email,
    subject: `[${reasonLabel}] Message from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2a5144;">New message from the Goke contact form</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name</strong></td>
            <td style="padding: 8px 0; color: #1a1a1a;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
            <td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Reason</strong></td>
            <td style="padding: 8px 0; color: #1a1a1a;">${reasonLabel}</td>
          </tr>
        </table>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
          <strong style="color: #666; display: block; margin-bottom: 8px;">Message</strong>
          <p style="color: #1a1a1a; margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Reply directly to this email to respond to ${data.name}.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message ?? "Failed to send message. Please try again.");
  }
}
