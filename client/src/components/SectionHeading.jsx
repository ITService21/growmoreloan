import { useScrollAnimation } from '../utils/hooks';

export default function SectionHeading({ title, subtitle, badge, light = false, centered = true }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'visible' : ''} mb-14 ${centered ? 'text-center' : ''}`}
    >
      {badge && (
        <div className={`mb-5 ${centered ? 'flex justify-center' : ''}`}>
          <span className={`section-badge ${light ? '' : ''}`}>
            <span>✦</span>
            {badge}
          </span>
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${
          light ? 'text-[#1a1710]' : 'text-white'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      <div
        className={`h-1 w-24 rounded-full bg-gradient-to-r from-[#F97316] via-[#FBBF24] to-[#22C55E] mb-5 ${
          centered ? 'mx-auto' : ''
        }`}
      />
      {subtitle && (
        <p
          className={`text-base sm:text-lg max-w-3xl leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-[#5a5040]' : 'text-[#B8A98A]'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
