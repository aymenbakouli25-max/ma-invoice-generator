const axios = require('axios');
const cheerio = require('cheerio');

// إعداد الـ User Agent للتخفي (كأنك متصفح Chrome على Windows)
const config = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Referer': 'https://lek-manga.net/'
    }
};

const BASE_URL = 'https://lek-manga.net/';

async function scrapeEverything() {
    try {
        console.log("🔍 جاري جلب "الكل شيء" من مانجا ليك...");
        
        const { data } = await axios.get(BASE_URL, config);
        const $ = cheerio.load(data);
        
        let results = [];

        $('.page-item-detail').each((i, el) => {
            const manga = {
                title: $(el).find('.post-title h3 a').text().trim(),
                link: $(el).find('.post-title h3 a').attr('href'),
                cover: $(el).find('img').attr('data-src') || $(el).find('img').attr('src'),
                latestChapter: $(el).find('.chapter a').first().text().trim()
            };
            if(manga.title) results.push(manga);
        });

        console.log("✅ تم استخراج " + results.length + " مانهوا.");
        console.log(JSON.stringify(results, null, 2));
        
        // هنا يمكنك إضافة كود الحفظ في Supabase كما شرحنا سابقاً
        return results;

    } catch (error) {
        console.error("❌ الموقع حظر الاتصال أو الرابط تغير. تأكد من الـ Referer.");
    }
}

scrapeEverything();
