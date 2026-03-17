import { next } from '@vercel/edge';
import type { RequestContext } from '@vercel/edge';

export const config = {
    // Only run middleware on pages, not on API routes or static files
    matcher: [
        '/((?!api|_vercel|.*\\..*$).*)',
    ],
};

// Common search engine and social media crawler user agents
const BOT_USER_AGENTS = [
    'googlebot',
    'yahoo! slurp',
    'bingbot',
    'yandex',
    'baiduspider',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'developers.google.com/+/web/snippet',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'google page speed',
    'qwantify',
    'pinterestbot',
    'bitrix link preview',
    'xing-contenttabreceiver',
    'chrome-lighthouse',
    'telegrambot'
];

export default async function middleware(request: Request, context: RequestContext) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

    // 1. Check if the request is from a known bot
    const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

    // 2. If it's a bot, we want to serve the Prerendered HTML
    if (isBot) {
        const prerenderToken = process.env.PRERENDER_TOKEN;

        if (prerenderToken) {
            // The exact URL that the bot requested
            const targetUrl = request.url;

            // Construct the Prerender.io API URL 
            const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

            try {
                // Fetch the perfectly rendered HTML snapshot from Prerender.io
                const prerenderResponse = await fetch(prerenderUrl, {
                    headers: {
                        'X-Prerender-Token': prerenderToken,
                        'User-Agent': userAgent // Forward the original user agent
                    },
                });

                // Add a custom header so we can verify the proxy worked if needed
                const newHeaders = new Headers(prerenderResponse.headers);
                newHeaders.set('x-prerendered', 'true');

                // Return the HTML directly to the Bot
                return new Response(prerenderResponse.body, {
                    status: prerenderResponse.status,
                    statusText: prerenderResponse.statusText,
                    headers: newHeaders
                });
            } catch (error) {
                console.error('Prerender middleware error:', error);
                // If Prerender fails, we fall back to normal execution
            }
        } else {
            console.warn('Bot detected, but PRERENDER_TOKEN is missing in Environment Variables.');
        }
    }

    // 3. Normal users proceed to the fast React SPA without modification
    return next();
}
