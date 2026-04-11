export default function AboutManagementPage() {
  return (
    <div className="font-body custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-10 pb-24">
        <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-amber-500 font-medium mb-1 tracking-wider uppercase text-xs">
              System Content
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline leading-tight">
              About Management
            </h1>
            <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-3xl">
              Manage the public about page, brand identity, and company information from one place.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl border border-outline-variant text-slate-300 font-medium hover:bg-white/5 transition-all">
              Preview
            </button>
            <button className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Changes
            </button>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100">About Us Content</h2>
                </div>
                <div className="flex gap-2 text-slate-400">
                  <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined">format_bold</span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined">format_italic</span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined">format_list_bulleted</span>
                  </button>
                  <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                    <span className="material-symbols-outlined">link</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full h-64 sm:h-96 bg-surface-container-low border-none rounded-xl p-4 sm:p-6 text-slate-300 leading-[1.8] focus:ring-2 focus:ring-primary/30 transition-all resize-none font-body text-base"
                  placeholder="Write your about page content here..."
                  defaultValue={`We are a premium cricket platform delivering real-time updates and an elevated gaming experience. Our mission is to combine a passion for cricket with modern technology to create a trusted community. For over 10 years, we have been serving thousands of users with reliable services.\n\nOur commitments:\n1. Transparent gaming policy\n2. Fast payment processing\n3. 24/7 customer support`}
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-headline">
                  Word count: 213 | Character count: 1,450
                </div>
              </div>
            </article>

            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">image</span>
                Brand Logo and Banner
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-primary/50 transition-all cursor-pointer group text-center">
                  <div className="w-20 h-20 mx-auto rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary">
                      upload_file
                    </span>
                  </div>
                  <p className="text-slate-100 font-bold">Upload Logo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG or SVG (500x500 px)</p>
                </div>

                <div className="p-6 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-primary/50 transition-all cursor-pointer group text-center">
                  <div className="w-20 h-20 mx-auto rounded-xl bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary">
                      add_photo_alternate
                    </span>
                  </div>
                  <p className="text-slate-100 font-bold">Banner Image</p>
                  <p className="text-xs text-slate-500 mt-1">JPEG or WebP (1920x480 px)</p>
                </div>
              </div>
            </article>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-6 sm:space-y-8">
            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6">General Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website Name</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary"
                    type="text"
                    defaultValue="Gain Live"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Contact Email</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary"
                    type="email"
                    defaultValue="info@gainlive.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Helpline Number</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary"
                    type="text"
                    defaultValue="+880 1700-000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Office Address</label>
                  <textarea
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-slate-100 focus:ring-1 focus:ring-primary h-24 resize-none"
                    defaultValue="Gulshan 2, Dhaka 1212, Bangladesh"
                  />
                </div>
              </div>
            </article>

            <article className="bg-surface-container rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-6">Social Media Links</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-slate-400">public</span>
                  <input
                    className="flex-1 bg-transparent border-none text-sm text-slate-100 focus:ring-0"
                    placeholder="Facebook page link"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-slate-400">chat</span>
                  <input
                    className="flex-1 bg-transparent border-none text-sm text-slate-100 focus:ring-0"
                    placeholder="Telegram channel"
                    type="text"
                  />
                </div>
              </div>
            </article>

            <article className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Public View Status
                </h4>
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-12 h-6 bg-secondary-container rounded-full relative p-1 cursor-pointer transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">Live (Visible)</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-8xl">language</span>
              </div>
            </article>
          </aside>
        </section>

        <section className="mt-12 glass-panel border border-white/5 rounded-[2rem] p-8 sm:p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
            <span className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-headline">
              Live Preview
            </span>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-headline mb-8">
              Learn About Us
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed font-body italic border-l-4 border-primary pl-6 py-2 mb-10 bg-white/5 rounded-r-xl">
                "Cricket is not just a game, it is an emotion. We bring that emotion to your
                fingertips through technology."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-12">
                <div>
                  <h6 className="text-primary font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">target</span>
                    Our Mission
                  </h6>
                  <p className="text-slate-400 leading-relaxed">
                    Provide the best user experience through modern analytics and a premium
                    interface.
                  </p>
                </div>
                <div>
                  <h6 className="text-primary font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">stars</span>
                    Our Achievement
                  </h6>
                  <p className="text-slate-400 leading-relaxed">
                    More than 1 million active users and a nationwide cricket network.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-8 sm:gap-12">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">10+</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Years Experience</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">500K+</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Active Users</span>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-100 font-headline">99.9%</span>
                <span className="text-xs text-slate-500 uppercase font-headline tracking-tighter">Uptime</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-20 bottom-0 opacity-20 pointer-events-none">
            <img
              alt="Background"
              className="w-[600px] h-[400px] object-cover rounded-tl-[10rem]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv57Lf3ywk4pfuJR9VMqSRcJTpumrlRua0rTv6NjLN0-SQkoWPQ6U01q3pUc5mYAvechU6zRuj-gDjbu2jgokk-IaJML7AwxPPYCMAC6LXxR3P0XZfffO1CCIxP8W3TmNis7UHrp8-_qw2zeZj7M6ldj58xdv3N88k4uHuK46Lm2VzaY0itHM4VzFxCAPr6sUeMYFAVOEDLxiJIJlxaAc--Ksg9SQ6sjSkDgGLCLaJKZMkGBa9A58dpdieX268HKjLWn4QKyTNKQ"
            />
          </div>
        </section>
      </div>
    </div>
  );
}