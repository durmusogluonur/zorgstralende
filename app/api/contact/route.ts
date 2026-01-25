import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend (will use RESEND_API_KEY from environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [ip, data] of entries) {
    if (data.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    // In development, allow requests without token if secret is not configured
    if (process.env.NODE_ENV === 'development') {
      console.warn('reCAPTCHA secret not configured, skipping verification in development');
      return true;
    }
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true && data.score >= 0.5; // Score threshold (0.0 to 1.0)
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 5000); // Max length
}

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitStore.get(ip);

  if (!userData || userData.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userData.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message, privacyConsent, recaptchaToken } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate privacy consent
    if (!privacyConsent) {
      return NextResponse.json(
        { error: 'Privacy consent is required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken || '');
    if (!recaptchaValid) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedMessage = sanitizeInput(message);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email using Resend if API key is configured
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Stralendezorg <onboarding@resend.dev>', // Test domain - replace with your domain later
          to: ['durmusogluonur@gmail.com'], // Test email - change to info@stralendezorg.nl for production
          subject: `Nieuw Contactformulier - ${sanitizedName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0284c7;">Nieuw Contactformulier</h2>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Naam:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> ${sanitizedEmail}</p>
                <p><strong>Telefoon:</strong> ${sanitizedPhone}</p>
                <p><strong>Bericht:</strong></p>
                <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
              </div>
              <p style="color: #6b7280; font-size: 12px;">
                Dit bericht is verzonden via het contactformulier op stralendezorg.nl<br />
                IP: ${ip}
              </p>
            </div>
          `,
          replyTo: sanitizedEmail,
        });
      } catch (emailError) {
        console.error('Resend email error:', emailError);
        // Continue even if email fails - log the submission
      }
    } else {
      // If Resend is not configured, just log (for development)
      console.log('Resend not configured. Contact form submission:', { name, email, phone, message });
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
