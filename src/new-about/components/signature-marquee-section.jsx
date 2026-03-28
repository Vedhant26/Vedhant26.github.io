
import { motion } from "framer-motion"

export default function SignatureMarqueeSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center z-0 overflow-hidden">
      <div className="w-full flex flex-col gap-4 md:gap-8 py-10 select-none pointer-events-none">
        {/* Top Line - Moving Right */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            className="flex whitespace-nowrap"
            style={{ willChange: 'transform' }}
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...Array(2)].map((_, i) => (
              <h2
                key={i}
                className="font-[family-name:var(--font-brier)] text-[12vw] md:text-[8vw] text-[#D1FF1C] leading-[0.9] tracking-tight px-4"
              >
                REDEFINING LIMITS REDEFINING LIMITS REDEFINING LIMITS REDEFINING LIMITS
              </h2>
            ))}
          </motion.div>
        </div>

        {/* Bottom Line - Moving Left */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            className="flex whitespace-nowrap"
            style={{ willChange: 'transform' }}
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...Array(2)].map((_, i) => (
              <h2
                key={i}
                className="font-[family-name:var(--font-oswald)] font-bold uppercase text-[12vw] md:text-[8vw] text-white leading-[0.9] tracking-tighter px-4"
              >
                FIGHTING FOR VICTORIES FIGHTING FOR VICTORIES FIGHTING FOR VICTORIES FIGHTING FOR VICTORIES
              </h2>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}





