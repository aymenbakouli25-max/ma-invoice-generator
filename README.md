<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قراءة الفصل - ShadowManga</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
        body { font-family: 'Tajawal', sans-serif; background-color: #050505; color: white; }
        .manga-page { max-width: 100%; height: auto; display: block; margin: 0 auto; transition: opacity 0.5s; }
        /* إخفاء شريط الأدوات عند القراءة */
        .reader-nav { background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); transition: 0.3s; }
    </style>
</head>
<body>

    <nav class="reader-nav fixed top-0 w-full z-50 p-4 border-b border-white/5 flex justify-between items-center no-print">
        <a href="index.html" class="text-xs bg-white/10 px-4 py-2 rounded-xl hover:bg-blue-600 transition">🏠 العودة</a>
        <div class="text-center">
            <h2 id="manga-title" class="text-sm font-black text-blue-500 uppercase">One Piece</h2>
            <p id="chapter-num" class="text-[10px] text-slate-500 font-bold">الفصل 1111</p>
        </div>
        <div class="flex gap-2">
            <button class="bg-white/10 p-2 rounded-lg text-xs">السابق</button>
            <button class="bg-blue-600 p-2 rounded-lg text-xs font-bold">التالي</button>
        </div>
    </nav>

    <main class="pt-20 pb-20 space-y-1 bg-black">
        <img src="https://images.shonenjump.com/7-1/1.jpg" class="manga-page" alt="Page 1" loading="lazy">
        <img src="https://images.shonenjump.com/7-1/2.jpg" class="manga-page" alt="Page 2" loading="lazy">
        <img src="https://images.shonenjump.com/7-1/3.jpg" class="manga-page" alt="Page 3" loading="lazy">
        <img src="https://images.shonenjump.com/7-1/4.jpg" class="manga-page" alt="Page 4" loading="lazy">
        
        <div class="max-w-2xl mx-auto p-10">
            <button class="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-600/30 transition-all active:scale-95">
                الفصل القادم ⮕
            </button>
        </div>
    </main>

    <footer class="fixed bottom-0 w-full bg-black/80 p-4 border-t border-white/5 flex justify-center gap-10 no-print">
        <span class="text-[10px] text-slate-500">النمط: عمودي</span>
        <span class="text-[10px] text-slate-500">الجودة: عالية</span>
    </footer>

    <script>
        // كود بسيط لجعل الصور تظهر بسلاسة عند التمرير
        document.addEventListener("DOMContentLoaded", function() {
            const images = document.querySelectorAll('.manga-page');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                    }
                });
            });
            images.forEach(img => {
                img.style.opacity = 0;
                observer.observe(img);
            });
        });
    </script>

</body>
</html>
