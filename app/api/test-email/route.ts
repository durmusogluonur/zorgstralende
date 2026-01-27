import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Test endpoint to verify Resend email service configuration
 * Access: GET /api/test-email
 */
export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RESEND_API_KEY not configured',
          message: 'Please set RESEND_API_KEY environment variable',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: 'Stralendezorg <onboarding@resend.dev>',
      to: 'durmusogluonur@gmail.com',
      subject: 'Test Email from Hostinger',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0284c7;">Test Email</h2>
          <p>This is a test email from your Hostinger deployment.</p>
          <p>If you receive this email, your Resend configuration is working correctly!</p>
          <p style="color: #6b7280; font-size: 12px;">
            Sent from: ${process.env.NODE_ENV || 'unknown'} environment
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: result,
      apiKeyConfigured: !!apiKey,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...',
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
        details: {
          name: error?.name,
          status: error?.status,
          code: error?.code,
        },
        apiKeyConfigured: !!process.env.RESEND_API_KEY,
      },
      { status: 500 }
    );
  }
}
