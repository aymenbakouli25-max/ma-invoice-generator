const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// المفاتيح الحقيقية للروبوت
const supabase = createClient(
    'https://dsjxjvyjscoxgnjhmnjf.supabase.co', 
    'sb_secret_A6Qn7bqRd0knPuf7_mn_JQ_QyMbtaNH' // مفتاح السكرت السري
);

async function startScraping() {
    try {
        console.log("📡 جاري الاتصال بموقع مانجا ليك...");
        const { data } = await axios.get('https://lek-manga.net/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        $('.page-item-detail').each(async (i, el) => {
            const title = $(el).find('.post-title h3 a').text().trim();
            const cover = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            const chapter = $(el).find('.chapter a').first().text().trim();
            const chapterLink = $(el).find('.chapter a').first().attr('href');

            if (title && chapterLink) {
                // جلب الصور داخل الفصل
                const chPage = await axios.get(chapterLink);
                const ch$ = cheerio.load(chPage.data);
                let images = [];
                ch$('.reading-content img').each((j, img) => {
                    let src = ch$(img).attr('src')?.trim();
                    if(src) images.push(src);
                });

                // حفظ في Supabase
                const { error } = await supabase.from('manga').upsert({
                    title: title,
                    cover_url: cover,
                    latest_chapter: chapter,
                    images_json: JSON.stringify(images),
                    updated_at: new Date()
                }, { onConflict: 'title' });

                if(!error) console.log(`✅ تم تحديث: ${title}`);
                else console.log(`❌ خطأ في ${title}: ${error.message}`);
            }
        });
    } catch (err) { console.error("❌ عطل تقني:", err.message); }
}

startScraping();
