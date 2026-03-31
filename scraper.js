const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// ربط مشروعك الفعلي باستخدام المفتاح السري (Secret Key) من صورتك
const supabase = createClient(
    'https://dsjxjvyjscoxgnjhmnjf.supabase.co', 
    'sb_secret_A6Qn7bqRd0knPuf7_mn_JQ_QyMbtaNH'
);

async function startScraping() {
    try {
        console.log("🚀 جاري سحب المانجا لموقع ShadowManga...");
        const { data } = await axios.get('https://lek-manga.net/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const $ = cheerio.load(data);

        $('.page-item-detail').each(async (i, el) => {
            const title = $(el).find('.post-title h3 a').text().trim();
            const cover = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            const chapterLink = $(el).find('.chapter a').first().attr('href');
            const chapterNum = $(el).find('.chapter a').first().text().trim();

            if (title && chapterLink) {
                // سحب الصفحات من داخل الفصل
                const chPage = await axios.get(chapterLink);
                const ch$ = cheerio.load(chPage.data);
                let images = [];
                ch$('.reading-content img').each((j, img) => {
                    let src = ch$(img).attr('src')?.trim();
                    if(src) images.push(src);
                });

                // إرسال البيانات إلى Supabase
                const { error } = await supabase.from('manga').upsert({
                    title: title,
                    cover_url: cover,
                    latest_chapter: chapterNum,
                    images_json: JSON.stringify(images),
                    updated_at: new Date()
                }, { onConflict: 'title' });

                if(!error) console.log(`✅ تم تحديث: ${title}`);
                else console.log(`❌ خطأ في ${title}: ${error.message}`);
            }
        });
    } catch (err) { console.error("❌ عطل:", err.message); }
}

startScraping();
