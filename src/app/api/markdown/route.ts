import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/siteConfig';

function homeMarkdown(): string {
  const { brand, courses, pricing, faqs } = siteConfig;
  return `# ${brand.name}

> ${brand.description}

- **Website:** ${brand.url}
- **Pricing:** ${brand.url}/pricing
- **Contact:** ${brand.url}/contact (${brand.contact.email}, WhatsApp ${brand.contact.phoneDisplay})
- **Location:** ${brand.contact.locationDetail} (and online/hybrid)

## Courses
${courses
  .map(
    (c) =>
      `### ${c.title}\n- Audience: ${c.intendedLearner}\n- Summary: ${c.tagline}\n- Format: ${c.lessonFormat}`
  )
  .join('\n\n')}

## Tuition Fees
${pricing.tiers.map((t) => `- **${t.name}**: ${t.price} (${t.billingCycle}) — ${t.summary}`).join('\n')}

## Frequently Asked Questions
${faqs.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n')}

See also: [llms.txt](${brand.url}/llms.txt) | [sitemap.xml](${brand.url}/sitemap.xml)
`;
}

function pricingMarkdown(): string {
  const { brand, pricing } = siteConfig;
  return `# ${pricing.headline} — ${brand.name}

${pricing.subheadline}

${pricing.tiers
  .map(
    (t) =>
      `## ${t.name} — ${t.price} (${t.billingCycle})\n${t.summary}\n${t.features
        .map((f) => `- ${f}`)
        .join('\n')}`
  )
  .join('\n\n')}

Book a coding trial at ${brand.url}/#trial-enquiry or see [llms.txt](${brand.url}/llms.txt).
`;
}

function contactMarkdown(): string {
  const { brand, enquiryConfig } = siteConfig;
  return `# Contact ${brand.name}

- Email: ${brand.contact.email}
- WhatsApp / Phone: ${brand.contact.phoneDisplay}
- Location: ${brand.contact.locationDetail} (Singapore & Online)
- Response Time: ${enquiryConfig.trialTimelineNotice}

Book a coding trial online at ${brand.url}/#trial-enquiry or see [llms.txt](${brand.url}/llms.txt).
`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetPath = (searchParams.get('path') || '/').replace(/\/+$/, '') || '/';
  const headers = {
    'Content-Type': 'text/markdown; charset=utf-8',
    Vary: 'Accept',
  };

  if (targetPath === '/') {
    return new NextResponse(homeMarkdown(), { status: 200, headers });
  }
  if (targetPath === '/pricing') {
    return new NextResponse(pricingMarkdown(), { status: 200, headers });
  }
  if (targetPath === '/contact') {
    return new NextResponse(contactMarkdown(), { status: 200, headers });
  }
  if (targetPath === '/privacy') {
    return new NextResponse(
      `# Privacy Policy — ${siteConfig.brand.name}\n\n${siteConfig.enquiryConfig.privacyGuarantee}\n\nRead full policy at ${siteConfig.brand.url}/privacy or see [llms.txt](${siteConfig.brand.url}/llms.txt).\n`,
      { status: 200, headers }
    );
  }
  if (targetPath === '/cookies') {
    return new NextResponse(
      `# Cookie Policy — ${siteConfig.brand.name}\n\nBaseCase Learning stores essential cookie preferences locally in browser storage. Full details at ${siteConfig.brand.url}/cookies or see [llms.txt](${siteConfig.brand.url}/llms.txt).\n`,
      { status: 200, headers }
    );
  }

  return new NextResponse(
    `# 404 — Page Not Found\n\nThe requested page \`${targetPath}\` does not exist on ${siteConfig.brand.name}.\n\nHelpful links:\n- Overview for AI agents: ${siteConfig.brand.url}/llms.txt\n- Sitemap: ${siteConfig.brand.url}/sitemap.xml\n- Home: ${siteConfig.brand.url}/\n`,
    { status: 404, headers }
  );
}
