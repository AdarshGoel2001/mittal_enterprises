import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TRANSCRIPT = 20;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
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
  const organization = String(body.organization ?? '').trim();
  const context = String(body.context ?? '').trim();
  const pathname = String(body.pathname ?? '').trim();
  const rawTranscript = Array.isArray(body.transcript) ? body.transcript : [];

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const transcript: TranscriptEntry[] = rawTranscript
    .map((entry: unknown): TranscriptEntry | null => {
      if (!entry || typeof entry !== 'object') return null;
      const e = entry as { role?: unknown; content?: unknown };
      const role = e.role === 'assistant' ? 'assistant' : e.role === 'user' ? 'user' : null;
      if (!role) return null;
      const content = String(e.content ?? '').trim();
      if (!content) return null;
      const cleaned = role === 'assistant' ? content.replace(/\[\d+\]/g, '').trim() : content;
      return { role, content: cleaned };
    })
    .filter((e): e is TranscriptEntry => e !== null)
    .slice(-MAX_TRANSCRIPT);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.MAIL_FROM || 'Mittal Enterprises <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.error('Chat lead route misconfigured: missing RESEND_API_KEY or CONTACT_EMAIL.');
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const fields: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Organization', organization || '—'],
    ['Context', context || '—'],
    ['Page', pathname || '—'],
  ];

  const transcriptHtml = transcript
    .map(
      (entry) =>
        `<p style="margin:0 0 8px;"><strong>${entry.role === 'user' ? 'User' : 'Assistant'}:</strong><br>${escapeHtml(entry.content).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');

  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#111;">
    <h2 style="margin:0 0 16px;font-size:16px;">New chat lead</h2>
    ${fields
      .map(
        ([k, v]) =>
          `<p style="margin:0 0 8px;"><strong>${k}:</strong> ${escapeHtml(v).replace(/\n/g, '<br>')}</p>`,
      )
      .join('')}
    <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
    <h3 style="margin:0 0 12px;font-size:14px;">Transcript (last ${transcript.length})</h3>
    ${transcriptHtml || '<p style="margin:0;color:#666;">No transcript available.</p>'}
  </div>`;

  const transcriptText = transcript
    .map((entry) => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`)
    .join('\n\n');

  const text = [
    ...fields.map(([k, v]) => `${k}: ${v}`),
    '',
    `Transcript (last ${transcript.length}):`,
    transcriptText,
  ].join('\n');

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Mittal Enterprises] Chat lead: ${name}`,
      html,
      text,
    });
    if (result.error) {
      console.error('Resend error (chat lead):', result.error);
      return NextResponse.json({ error: 'Failed to send lead.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Chat lead send exception:', err);
    return NextResponse.json({ error: 'Failed to send lead.' }, { status: 500 });
  }
}
