"use client"

export default function AIChat() {
  return (
    <section
      id="ai-chat"
      className="py-24 bg-gradient-to-br from-white via-gray-100 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-black uppercase tracking-[0.2em]">
              AI Match Concierge
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              Chat with our{" "}
              <span className="underline decoration-black">
                SG Dating AI
              </span>
            </h2>

            <p className="text-lg text-black/80 leading-relaxed max-w-xl">
              Get instant help with profile feedback, better openers, date ideas,
              and dating safety tips — powered by SG Dating App AI.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Profile feedback", "Better openers", "Date ideas", "Safety tips"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white text-black text-sm border border-black/20"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* RIGHT SIDE – BOTPRESS CHAT */}
          <div className="w-full h-[520px] rounded-3xl border border-black/20 shadow-xl overflow-hidden bg-white">
            <iframe
              src="https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2026/01/15/13/20260115133623-39SAFEXB.json"
              className="w-full h-full border-none"
              loading="lazy"
              title="SG Dating AI Chat"
            />
          </div>

        </div>
      </div>
    </section>
  )
}