export default function PolicyPage() {
  return (
    <div className="font-body bengali-font">
      <div className="max-w-6xl mx-auto pb-12">
        <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline tracking-tight">
              পলিসি ব্যবস্থাপনা
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              পাবলিক নীতি, শর্তাবলী এবং রেসপনসিবল গেমিং কনটেন্ট পরিচালনা করুন।
            </p>
          </div>

          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all w-fit">
            <span className="material-symbols-outlined text-lg">publish</span>
            প্রকাশ করুন
          </button>
        </section>

        <section className="flex flex-wrap items-center gap-2 bg-surface-container-low p-1 rounded-xl mb-10 w-fit">
          <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-surface-container-highest text-primary shadow-lg transition-all">
            গোপনীয়তা নীতি
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
            ব্যবহারের শর্তাবলী
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
            দায়িত্বশীল গেমিং
          </button>
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
            রিফান্ড নীতি
          </button>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-surface-container rounded-xl overflow-hidden editorial-shadow">
              <div className="bg-surface-container-high px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_bold</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_italic</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_underlined</span>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_list_bulleted</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">format_list_numbered</span>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">link</span>
                  <span className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">image</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">শেষ আপডেট: ১২ই জুলাই, ২০২৪</span>
              </div>

              <div className="p-6 sm:p-8 min-h-[500px] bg-[#1c2026]">
                <h2 className="text-3xl font-bold text-slate-100 mb-8 leading-tight">গোপনীয়তা নীতি (Privacy Policy)</h2>
                <div className="space-y-6 text-slate-400 bengali-font leading-[1.8] text-base">
                  <p>
                    আমাদের প্ল্যাটফর্ম ব্যবহার করার জন্য আপনাকে ধন্যবাদ। আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করা
                    আমাদের অন্যতম প্রধান লক্ষ্য। এই গোপনীয়তা নীতিতে আমরা বর্ণনা করেছি কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার
                    এবং সুরক্ষিত রাখা হয়।
                  </p>

                  <h3 className="text-xl font-bold text-primary mt-8 mb-4">১. তথ্য সংগ্রহ</h3>
                  <p>
                    আমরা যখন আপনি আমাদের পরিষেবাগুলিতে নিবন্ধন করেন তখন আপনার নাম, ইমেল ঠিকানা, ফোন নম্বর এবং পেমেন্ট
                    সংক্রান্ত তথ্য সংগ্রহ করতে পারি। গেমপ্লে চলাকালীন আমরা আপনার ডিভাইসের ধরণ এবং অবস্থান সংক্রান্ত সাধারণ
                    ডাটাও সংরক্ষণ করি।
                  </p>

                  <h3 className="text-xl font-bold text-primary mt-8 mb-4">২. তথ্যের ব্যবহার</h3>
                  <p>আপনার সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হয়:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>পরিষেবা প্রদান এবং অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করা।</li>
                    <li>নতুন ক্রিকেট ম্যাচ এবং অফার সম্পর্কে আপনাকে অবহিত করা।</li>
                    <li>লেনদেন সংক্রান্ত ভেরিফিকেশন এবং সাপোর্ট প্রদান।</li>
                  </ul>

                  <h3 className="text-xl font-bold text-primary mt-8 mb-4">৩. কুকিজ পলিসি</h3>
                  <p>
                    আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিংসে গিয়ে
                    এটি নিয়ন্ত্রণ করতে পারেন।
                  </p>

                  <div className="mt-12 p-6 rounded-lg bg-surface-container-high border-l-4 border-primary italic">
                    দ্রষ্টব্য: এই পলিসিটি যেকোন সময় পরিবর্তন করার অধিকার আমরা সংরক্ষণ করি। পরিবর্তনের ক্ষেত্রে ইমেলের
                    মাধ্যমে গ্রাহকদের অবহিত করা হবে।
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <article className="bg-surface-container rounded-xl p-6 editorial-shadow">
              <h3 className="text-sm font-bold text-slate-100 bengali-font mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  info
                </span>
                স্ট্যাটাস এবং মেটাডাটা
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500 bengali-font">বর্তমান অবস্থা</span>
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded bengali-font">প্রকাশিত</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500 bengali-font">সংস্করণ</span>
                  <span className="text-xs font-mono text-slate-300">v2.4.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-slate-500 bengali-font">ভাষা</span>
                  <span className="text-xs text-slate-300 bengali-font">বাংলা (Default)</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button className="w-full bg-surface-container-high hover:bg-white/5 text-slate-200 py-3 rounded-lg bengali-font text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">history</span>
                  পূর্ববর্তী সংস্করণ দেখুন
                </button>
                <button className="w-full bg-surface-container-high hover:bg-white/5 text-slate-200 py-3 rounded-lg bengali-font text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  প্রিভিউ দেখুন
                </button>
              </div>
            </article>

            <article className="bg-surface-container rounded-xl p-6 editorial-shadow">
              <h3 className="text-sm font-bold text-slate-100 bengali-font mb-6">সংযুক্ত মিডিয়া</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-surface-container-high mb-4">
                <img
                  alt="পলিসি হেডার ছবি"
                  className="w-full h-full object-cover opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj4spqWTrZZhf9_fhQxHCg9OTbJ6pyje9pKt7Le2FO6JIZ2bNM-SQzPe542SSpF1LT1RU-dLt8ocm5alQZ2lgRg9ITUuddrXPfhdBvitSW8kHqUKnQVphx4-0_rD_WJLGyoLENyDAwrDjIzo28O4dkLMiKOzdWqqHD1RhViPULyXdpTN3boxS2_EjC-5vxSjbOhqGKf_QMlhfZBZNk-coJMIDBuesdGTTWEhbAa3agXyJF3IudCXWTKm0EjLw3z6_qIIRco2s3Rg"
                />
              </div>
              <button className="w-full border-2 border-dashed border-white/10 hover:border-primary/40 text-slate-500 py-4 rounded-lg flex flex-col items-center gap-2 transition-all">
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <span className="text-[10px] bengali-font">নতুন ব্যানার যোগ করুন</span>
              </button>
            </article>

            <article className="bg-surface-container rounded-xl p-6 editorial-shadow">
              <h3 className="text-sm font-bold text-slate-100 bengali-font mb-4">অন্যান্য অনুবাদ</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">Bengali (Active)</span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] hover:text-slate-200 cursor-pointer transition-all">English</span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] hover:text-slate-200 cursor-pointer transition-all">Hindi</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}