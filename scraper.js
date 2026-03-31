const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');

// ربط مشروعك الفعلي (aymenbakouli25-max)
const supabase = createClient(
    'https://dsjxjvyjscoxgnjhmnjf.supabase.co', 
    'sb_secret_A6Qn7bqRd0knPuf7_mn_JQ_QyMbtaNH'
);

async function startScraping() {
    try {
        console.log("📡 جاري محاولة سحب البيانات من Mangalek...");
        
        // جربنا الرابط المباشر للمانجا الحديثة
        const { data } = await axios.get('https://lek-manga.net/', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html'
            }
        });
        
        const $ = cheerio.load(data);
        const mangaItems = $('.page-item-detail');
        
        console.log(`🔍 وجدنا ${mangaItems.length} عنصر في الصفحة`);

        for (let i = 0; i < mangaItems.length; i++) {
            const el = mangaItems[i];
            const title = $(el).find('.post-title h3 a').text().trim();
            const cover = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            const chapterNum = $(el).find('.chapter a').first().text().trim();

            if (title) {
                console.log(`📝 محاولة حفظ: ${title}`);
                const { error } = await supabase.from('manga').upsert({
                    title: title,
                    cover_url: cover,
                    latest_chapter: chapterNum,
                    updated_at: new Date()
                }, { onConflict: 'title' });

                if(error) console.log(`❌ فشل في قاعدة البيانات: ${error.message}`);
                else console.log(`✅ تم بنجاح: ${title}`);
            }
        }
        console.log("🏁 انتهت العملية!");
    } catch (err) {
        console.error("❌ عطل في السحب:", err.message);
    }
}

startScraping();
