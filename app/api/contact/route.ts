import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Google Cloud reCAPTCHA Enterprise client (lazy loaded)
// This will only be used if @google-cloud/recaptcha-enterprise is installed
let recaptchaClient: any = null;
let recaptchaModuleAvailable = false;

const getRecaptchaClient = async () => {
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    return null;
  }

  if (recaptchaClient) {
    return recaptchaClient;
  }

  if (recaptchaModuleAvailable === false) {
    // Module was already tried and failed, don't try again
    return null;
  }

  try {
    // Dynamic import with error handling
    // @ts-ignore - Module may not be installed, handled gracefully
    const recaptchaModule = await import('@google-cloud/recaptcha-enterprise').catch((error: any) => {
      if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
        console.warn('@google-cloud/recaptcha-enterprise not installed. Install with: npm install @google-cloud/recaptcha-enterprise');
        recaptchaModuleAvailable = false;
        return null;
      }
      throw error;
    });

    if (!recaptchaModule) {
      return null;
    }

    const { RecaptchaEnterpriseServiceClient } = recaptchaModule;
    recaptchaClient = new RecaptchaEnterpriseServiceClient();
    recaptchaModuleAvailable = true;
    return recaptchaClient;
  } catch (error: any) {
    console.error('Failed to initialize reCAPTCHA Enterprise client:', error);
    recaptchaModuleAvailable = false;
    return null;
  }
};

// Initialize Resend (will use RESEND_API_KEY from environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP
const MAX_STORE_SIZE = 10000; // Prevent memory leak

// Clean up old rate limit entries (only in Node.js environment)
let cleanupInterval: NodeJS.Timeout | null = null;
if (typeof setInterval !== 'undefined') {
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    
    // Clean up expired entries
    for (const [ip, data] of entries) {
      if (data.resetTime < now) {
        rateLimitStore.delete(ip);
      }
    }
    
    // Prevent memory leak - remove oldest entries if store is too large
    if (rateLimitStore.size > MAX_STORE_SIZE) {
      const sortedEntries = Array.from(rateLimitStore.entries())
        .sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toRemove = sortedEntries.slice(0, rateLimitStore.size - MAX_STORE_SIZE);
      for (const [ip] of toRemove) {
        rateLimitStore.delete(ip);
      }
    }
  }, 60000); // Clean up every minute
}

/**
 * Create an assessment to analyze the risk of a UI action using reCAPTCHA Enterprise.
 * Based on Google Cloud reCAPTCHA Enterprise SDK.
 * 
 * @param token - The generated token obtained from the client
 * @param recaptchaAction - Action name corresponding to the token (default: 'contact_form')
 * @returns Promise<boolean> - true if assessment passes, false otherwise
 */
async function createAssessment(
  token: string,
  recaptchaAction: string = 'contact_form'
): Promise<boolean> {
  // If reCAPTCHA is not configured, allow the request (for development/testing)
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    console.warn('reCAPTCHA Enterprise not configured (GOOGLE_CLOUD_PROJECT_ID missing), skipping verification');
    return true;
  }

  // If token is not provided, reject in production
  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('reCAPTCHA token missing in production');
      return false;
    }
    // Allow in development
    return true;
  }

  try {
    const client = await getRecaptchaClient();
    if (!client) {
      console.warn('reCAPTCHA Enterprise client not available, falling back to basic verification');
      return await verifyRecaptchaBasic(token);
    }

    const projectID = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdTI1YsAAAAAHRh4YqhdNp0A8WGNEyNaICeb9LP';

    // Create the reCAPTCHA client and get project path
    const projectPath = client.projectPath(projectID);

    // Build the assessment request
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Check if the token is valid
    if (!response.tokenProperties?.valid) {
      console.error(`The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`);
      return false;
    }

    // Check if the expected action was executed
    // The `action` property is set by user client in the grecaptcha.enterprise.execute() method
    if (response.tokenProperties.action !== recaptchaAction) {
      console.error(`The action attribute in your reCAPTCHA tag does not match the action you are expecting to score. Expected: ${recaptchaAction}, Got: ${response.tokenProperties.action}`);
      return false;
    }

    // Get the risk score and the reason(s)
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha/docs/interpret-assessment
    const score = response.riskAnalysis?.score || 0;
    const threshold = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

    console.log(`The reCAPTCHA Enterprise score is: ${score}`);

    // Log risk reasons if available
    if (response.riskAnalysis?.reasons && response.riskAnalysis.reasons.length > 0) {
      response.riskAnalysis.reasons.forEach((reason: string) => {
        console.log(`Risk reason: ${reason}`);
      });
    }

    // Check if score meets threshold
    if (score < threshold) {
      console.warn(`reCAPTCHA Enterprise score ${score} is below threshold ${threshold}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('reCAPTCHA Enterprise verification error:', error);
    // Fallback to basic verification if Enterprise SDK fails
    return await verifyRecaptchaBasic(token);
  }
}

// Verify reCAPTCHA token (wrapper function)
async function verifyRecaptcha(token: string, action: string = 'contact_form'): Promise<boolean> {
  // Try Enterprise first, fallback to basic
  if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
    return await createAssessment(token, action);
  }
  
  // Fallback to basic verification
  return await verifyRecaptchaBasic(token);
}

// Basic reCAPTCHA verification (fallback)
async function verifyRecaptchaBasic(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return true; // Allow if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    });

    const data = await response.json();
    return data.success === true && (data.score || 0.5) >= 0.5;
  } catch (error) {
    console.error('reCAPTCHA basic verification error:', error);
    return false;
  }
}

// Sanitize input to prevent XSS and injection attacks
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    // Remove HTML tags and script content
    .replace(/<[^>]*>/g, '')
    // Remove script, style, iframe tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove dangerous characters
    .replace(/[<>'"&]/g, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove on* event handlers
    .replace(/\son\w+\s*=/gi, '')
    // Trim and limit length
    .trim()
    .slice(0, 5000);
}

// Escape HTML for safe display in email templates
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
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
    // Get client IP for rate limiting (with validation)
    const getClientIP = (request: NextRequest): string => {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIP = request.headers.get('x-real-ip');
      
      // Validate IP format (basic check)
      const isValidIP = (ip: string): boolean => {
        // IPv4 or IPv6 basic validation
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === 'unknown';
      };

      if (forwardedFor) {
        const firstIP = forwardedFor.split(',')[0].trim();
        if (isValidIP(firstIP)) {
          return firstIP;
        }
      }
      
      if (realIP && isValidIP(realIP)) {
        return realIP;
      }
      
      return 'unknown';
    };

    const ip = getClientIP(request);

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

    // Verify reCAPTCHA Enterprise
    const recaptchaValid = await verifyRecaptcha(recaptchaToken || '', 'contact_form');
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

    // Validate email format (more strict)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate phone number (basic check)
    if (sanitizedPhone.length < 10 || sanitizedPhone.length > 20) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Validate name length
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      );
    }

    // Validate message length
    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Send email using Resend if API key is configured
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Stralendezorg <onboarding@resend.dev>', // Test domain - replace with your domain later
          to: ['durmusogluonur@gmail.com'], // Test email - change to info@stralendezorg.nl for production
          subject: `Nieuw Contactformulier - ${escapeHtml(sanitizedName)}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0284c7;">Nieuw Contactformulier</h2>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Naam:</strong> ${escapeHtml(sanitizedName)}</p>
                <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
                <p><strong>Telefoon:</strong> ${escapeHtml(sanitizedPhone)}</p>
                <p><strong>Bericht:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(sanitizedMessage)}</p>
              </div>
              <p style="color: #6b7280; font-size: 12px;">
                Dit bericht is verzonden via het contactformulier op stralendezorg.nl<br />
                IP: ${escapeHtml(ip)}
              </p>
            </div>
          `,
          replyTo: sanitizedEmail,
        });
      } catch (emailError: any) {
        console.error('Resend email error:', emailError);
        console.error('Error details:', {
          message: emailError?.message,
          status: emailError?.status,
          name: emailError?.name,
        });
        // Log to help debug Hostinger deployment issues
        if (process.env.NODE_ENV === 'production') {
          console.error('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);
          console.error('Resend client initialized:', !!resend);
        }
        // Continue even if email fails - log the submission
      }
    } else {
      // If Resend is not configured, log detailed info for debugging
      console.warn('Resend not configured. Contact form submission logged:', { 
        name: sanitizedName, 
        email: sanitizedEmail, 
        phone: sanitizedPhone,
        messageLength: sanitizedMessage.length 
      });
      console.warn('RESEND_API_KEY environment variable:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error('Error processing contact form:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return generic error message to prevent information disclosure
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}
