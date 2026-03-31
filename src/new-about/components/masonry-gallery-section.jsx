import { useRef } from "react"
import Image from "./ui/image"
import { motion } from "framer-motion"

const galleryImages = [
  {
    src: "/images/lorenzo-piloto1.jpeg",
    alt: "Action shot 1",
  },
  {
    src: "/images/lorenzo-piloto2.jpeg",
    alt: "Action shot 2",
  },
  {
    src: "/images/lofan/baba.jpeg",
    alt: "Fan moment",
  },
  {
    src: "/images/lofan/vbb.jpeg",
    alt: "Fan moment 2",
  },
  {
    src: "/images/lorenzo-piloto7.jpeg",
    alt: "Action shot 3",
  },
  {
    src: "/images/lorenzo-piloto5.jpeg",
    alt: "Action shot 4",
  },
  {
    src: "/images/lorenzo-podio3.jpeg",
    alt: "Podium celebration 1",
  },
  {
    src: "/images/dasdas.jpeg",
    alt: "Podium celebration 2",
  },
]

export default function MasonryGallerySection() {
  return (
    <section
      id="masonry-gallery"
      style={{
        padding: '4rem 1.5rem',
        background: '#0a0a0a',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            color: '#fff',
          }}>
            Photo Gallery
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>Moments captured in frames</p>
        </motion.div>

        {/* Square Photo Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              viewport={{ once: true, margin: "0px" }}
              whileHover={{ scale: 1.03 }}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#111',
                border: '1px solid #222',
                transition: 'border-color 0.3s ease',
              }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                priority={index < 4}
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
              {/* Hover overlay with alt text */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1rem',
              }}
                className="gallery-overlay"
              >
                <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
