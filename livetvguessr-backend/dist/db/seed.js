"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/db/seed.ts
const client_1 = require("@prisma/client");
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
const seedChannels = [
    // --- NORTH AMERICA ---
    {
        countryCode: 'US',
        countryName: 'United States',
        streamUrl: 'https://bloomberg.com/media-manifest/streams/us.m3u8', // Bloomberg US
        language: 'English',
        category: 'News',
    },
    {
        countryCode: 'MX',
        countryName: 'Mexico',
        streamUrl: 'https://mdstrm.com/live-stream-playlist/5a5e3ce8882ec25f201d120a.m3u8', // Milenio TV
        language: 'Spanish',
        category: 'News',
    },
    // --- SOUTH AMERICA ---
    {
        countryCode: 'BR',
        countryName: 'Brazil',
        streamUrl: 'https://evpp.yuvlive.com.br/evpp/recordnews/recordnews/playlist.m3u8', // Record News
        language: 'Portuguese',
        category: 'News',
    },
    {
        countryCode: 'AR',
        countryName: 'Argentina',
        streamUrl: 'https://edge-live-15.top-ix.org/c5n/c5n/playlist.m3u8', // C5N Argentina
        language: 'Spanish',
        category: 'News',
    },
    // --- EUROPE ---
    {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        streamUrl: 'https://skynews-live.akamaized.net/hls/live/2002219/skynews_international/master.m3u8', // Sky News UK
        language: 'English',
        category: 'News',
    },
    {
        countryCode: 'DE',
        countryName: 'Germany',
        streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', // DW Deutsch
        language: 'German',
        category: 'News',
    },
    {
        countryCode: 'FR',
        countryName: 'France',
        streamUrl: 'https://static.france24.com/live/F24_FR_HI_HLS/live_web.m3u8', // France 24
        language: 'French',
        category: 'News',
    },
    {
        countryCode: 'IT',
        countryName: 'Italy',
        streamUrl: 'https://skytg24-live.akamaized.net/hls/live/2006935/skytg24/master.m3u8', // Sky TG24
        language: 'Italian',
        category: 'News',
    },
    {
        countryCode: 'ES',
        countryName: 'Spain',
        streamUrl: 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main.m3u8', // RTVE 24h
        language: 'Spanish',
        category: 'News',
    },
    {
        countryCode: 'GR',
        countryName: 'Greece',
        streamUrl: 'https://ert-live-bcbs15228.siliconweb.com/media/ert_news/ert_news.m3u8', // ERT News
        language: 'Greek',
        category: 'News',
    },
    // --- ASIA ---
    {
        countryCode: 'JP',
        countryName: 'Japan',
        streamUrl: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/11-a/master.m3u8', // NHK World
        language: 'Japanese',
        category: 'General',
    },
    {
        countryCode: 'KR',
        countryName: 'South Korea',
        streamUrl: 'https://amdlive-ch01-ctnd-video.akamaized.net/hls/live/2007648/B-CH01/master.m3u8', // Arirang TV
        language: 'Korean',
        category: 'General',
    },
    {
        countryCode: 'IN',
        countryName: 'India',
        streamUrl: 'https://ndtvindia-lh.akamaihd.net/i/ndtvindia_1@199228/master.m3u8', // NDTV India
        language: 'Hindi',
        category: 'News',
    },
    {
        countryCode: 'CN',
        countryName: 'China',
        streamUrl: 'https://live.cgtn.com/1000/prog_index.m3u8', // CGTN
        language: 'Chinese',
        category: 'News',
    },
    {
        countryCode: 'TH',
        countryName: 'Thailand',
        streamUrl: 'https://live.thairath.co.th/trt/playlist.m3u8', // Thairath TV
        language: 'Thai',
        category: 'General',
    },
    // --- MIDDLE EAST & AFRICA ---
    {
        countryCode: 'QA',
        countryName: 'Qatar',
        streamUrl: 'https://live-hls-web-aja.getaj.net/AJA/index.m3u8', // Al Jazeera Arabic
        language: 'Arabic',
        category: 'News',
    },
    {
        countryCode: 'TR',
        countryName: 'Turkey',
        streamUrl: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8', // TRT Haber
        language: 'Turkish',
        category: 'News',
    },
    {
        countryCode: 'AE',
        countryName: 'United Arab Emirates',
        streamUrl: 'https://dmi.cdn.mangomolo.com/dubaitv/smil:dubaitv.smil/playlist.m3u8', // Dubai TV
        language: 'Arabic',
        category: 'General',
    },
    // --- OCEANIA ---
    {
        countryCode: 'AU',
        countryName: 'Australia',
        streamUrl: 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynews_international/master.m3u8', // Sky News Australia
        language: 'English',
        category: 'News',
    },
    {
        countryCode: 'NZ',
        countryName: 'New Zealand',
        streamUrl: 'https://ndshls.tvnz.co.nz/linear/bb1/1/index.m3u8', // TVNZ 1 (Often geoblocked outside AU/NZ, but worth testing)
        language: 'English',
        category: 'General',
    }
];
async function main() {
    console.log('🌱 Starting database seed...');
    // Wipe existing channels to prevent duplicates during testing
    await prisma.channel.deleteMany();
    console.log('🗑️  Cleared existing channels.');
    for (const channel of seedChannels) {
        const created = await prisma.channel.create({
            data: channel,
        });
        console.log(`✅ Added: ${created.countryName} (${created.category})`);
    }
    console.log('🎉 Seeding finished successfully.');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
