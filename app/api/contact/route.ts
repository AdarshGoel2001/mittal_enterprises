import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: 'Name, email, subject and message are required.' },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.MAIL_FROM || 'Mittal Enterprises <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.error('Contact route misconfigured: missing RESEND_API_KEY or CONTACT_EMAIL.');
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const fields: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Subject', subject],
    ['Message', message],
  ];

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#111;">
    <h2 style="margin:0 0 16px;font-size:16px;">New contact form submission</h2>
    ${fields
      .map(
        ([k, v]) =>
          `<p style="margin:0 0 8px;"><strong>${k}:</strong> ${escapeHtml(v).replace(/\n/g, '<br>')}</p>`,
      )
      .join('')}
  </div>`;

  const text = fields.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Mittal Enterprises] New contact: ${name}`,
      html,
      text,
    });
    if (result.error) {
      console.error('Resend error (contact):', result.error);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact send exception:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
