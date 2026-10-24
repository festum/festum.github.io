import { motion } from 'framer-motion';
import ZenBackdrop from './ZenBackdrop';

function Eyebrow({ text }: { text: string }) {
  return (
    <p className="text-xs tracking-[0.3em] uppercase text-champagne">
      <span className="inline-block w-6 h-px bg-champagne align-middle mr-3" />
      {text}
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <ZenBackdrop />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <section className="min-h-[85vh] flex items-center relative">
          <div className="mx-auto max-w-6xl px-6 w-full pt-24">
            <Eyebrow text="Applied Research · Est. MMXXII" />
            <h1 className="font-display text-5xl md:text-7xl mt-6 max-w-4xl">
              Your model answers everything. Ours answers once.
            </h1>
            <p className="text-mist max-w-2xl text-lg mt-6">
              An LLM's first draft is a paragraph; ours is a decision. We distil, quantise and prune until one answer is enough — smaller models, fewer tokens, less of everything except the part that decides.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <motion.a
                href="/products/"
                whileHover={{ y: -2 }}
                className="bg-champagne text-ink px-6 py-3 text-sm tracking-wide hover:bg-champagne-soft transition-colors"
              >
                Explore our work
              </motion.a>
              <motion.a
                href="https://blog.fesq.in"
                whileHover={{ y: -2 }}
                className="border border-champagne/60 text-champagne px-6 py-3 text-sm tracking-wide hover:border-champagne transition-colors"
              >
                Read the Journal
              </motion.a>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent mt-16" />
          </div>
        </section>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow text="Ethos" />
          <h2 className="font-display text-4xl mt-6">Less is the whole method.</h2>
          <p className="text-mist max-w-2xl mt-6">A model that does more with less is not a smaller model — it is a better-aimed one. We take away until only the decision is left.</p>
          <p className="text-mist max-w-2xl mt-4">No noise, no theatre — only the work, and what it leaves behind.</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow text="Intelligence" />
          <h2 className="font-display text-4xl mt-6">AI that does the work, not the demo.</h2>
          <p className="text-mist max-w-2xl mt-6">Models are material — studied, distilled and sharpened until they disappear into the work.</p>
          <p className="text-mist max-w-2xl mt-4">What remains is the system: running, deciding, finishing its job without us.</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow text="Experiments" />
          <h2 className="font-display text-4xl mt-6">Experiments, art, and everything in between.</h2>
          <p className="text-mist max-w-2xl mt-6">We treat research as a studio practice: build the strange version first, measure what it does, and keep only what surprises us.</p>
          <p className="text-mist max-w-2xl mt-4">An interface is a composition too. Restraint, rhythm, timing — the craft of a system is not decoration; it is how the work is understood.</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-4xl">Have a problem worth building quietly?</h2>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <motion.a
              href="/products/"
              whileHover={{ y: -2 }}
              className="bg-champagne text-ink px-6 py-3 text-sm tracking-wide hover:bg-champagne-soft transition-colors"
            >
              Explore our work
            </motion.a>
            <motion.a
              href="https://blog.fesq.in"
              whileHover={{ y: -2 }}
              className="border border-champagne/60 text-champagne px-6 py-3 text-sm tracking-wide hover:border-champagne transition-colors"
            >
              Read the Journal
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
