import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
    if (browser) {
        return browser;
    }

    console.log('[Browser] Launching new browser instance...');
    browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    browser.on('disconnected', () => {
        console.log('[Browser] Browser disconnected.');
        browser = null;
    });

    return browser;
}

export async function puppeteerScrape(url: string): Promise<string | null> {
    console.log(`[Scrapper] Scraping ${url}`);
    
    let page: Page | null = null;

    try {
        const browser = await getBrowser();
        page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        let streamUrl: string | null = null;

        try {
            const response = await page.waitForResponse(response => {
                const reqUrl = response.url();
                return reqUrl.includes('.m3u8') || reqUrl.includes('.mp4');
            }, { timeout: 20000 }); // Wait up to 20 seconds for a matching response
            streamUrl = response.url();
            console.log(`[Scrapper] Found stream URL: ${streamUrl}`);
        } catch (waitForError) {
            console.warn(`[Scrapper] No stream URL found within timeout for ${url}. Error: ${waitForError.message}`);
        }
        
        return streamUrl;

    } catch (error) {
        console.error(`[Scrapper] Error scraping ${url}:`, error);
        return null;
    } finally {
        if (page) {
            try {
                await page.close();
            } catch (error) {
                // ignore
            }
        }
    }
}
