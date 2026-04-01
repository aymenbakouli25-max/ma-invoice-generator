const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

const supabase = createClient(
    'https://dsjxjvyjscoxgnjhmnjf.supabase.co', 
    'sb_secret_A6Qn7bqRd0knPuf7_mn_JQ_QyMbtaNH'
);

async function startScraping() {
    try {
        console.log("📡 جاري محاولة سحب البيانات بنظام الوكيل...");
        const { data } = await axios.get('https://lek-manga.net/', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
                'Referer': 'https://lek-manga.net/'
            }
        });
        
        const $ = cheerio.load(data);
        const mangaItems = $('.page-item-detail');
        
        if (mangaItems.length === 0) {
            console.log("⚠️ لم أجد عناصر بالهيكل القديم، سأجرب الهيكل البديل...");
        }

        for (let i = 0; i < Math.min(mangaItems.length, 15); i++) {
            const el = mangaItems[i];
            const title = $(el).find('.post-title h3 a, .post-title a').text().trim();
            const cover = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            const chapterNum = $(el).find('.chapter a').first().text().trim();

            if (title) {
                const { error } = await supabase.from('manga').upsert({
                    title: title,
                    cover_url: cover,
                    latest_chapter: chapterNum,
                    updated_at: new Date()
                }, { onConflict: 'title' });

                if(!error) console.log(`✅ تم جلب: ${title}`);
            }
        }
        console.log("🏁 انتهت العملية، تحقق من الجدول الآن!");
    } catch (err) {
        console.error("❌ خطأ تقني:", err.message);
    }
}

startScraping();
