export default function AnimatedBackground({ variant = 'default' }) {
  return (
    <div className="animated-bg" aria-hidden="true">
      {/* Large gradient blobs — warm orange & green */}
      <div className="gradient-blob blob-orange" style={{ width: '500px', height: '500px', top: '-10%', right: '-5%' }} />
      <div className="gradient-blob blob-green" style={{ width: '400px', height: '400px', bottom: '-5%', left: '-8%' }} />
      <div className="gradient-blob blob-gold" style={{ width: '350px', height: '350px', top: '40%', left: '50%' }} />

      {/* Geometric shapes — triangles, circles, hexagons, squares */}
      {/* Triangle */}
      <svg className="geo-shape geo-float-1" style={{ top: '12%', left: '8%', width: 40, height: 40 }} viewBox="0 0 40 40">
        <polygon points="20,4 36,36 4,36" fill="none" stroke="rgba(249,115,22,0.12)" strokeWidth="1.5" />
      </svg>

      {/* Circle */}
      <svg className="geo-shape geo-float-2" style={{ top: '20%', right: '12%', width: 50, height: 50 }} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="1.5" />
      </svg>

      {/* Square rotated */}
      <svg className="geo-shape geo-float-3" style={{ bottom: '25%', left: '15%', width: 35, height: 35 }} viewBox="0 0 35 35">
        <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="1.5" transform="rotate(15 17.5 17.5)" />
      </svg>

      {/* Hexagon */}
      <svg className="geo-shape geo-float-4" style={{ top: '55%', right: '8%', width: 45, height: 45 }} viewBox="0 0 45 45">
        <polygon points="22.5,3 41,13 41,32 22.5,42 4,32 4,13" fill="none" stroke="rgba(249,115,22,0.08)" strokeWidth="1.5" />
      </svg>

      {/* Diamond */}
      <svg className="geo-shape geo-float-5" style={{ top: '70%', left: '5%', width: 30, height: 30 }} viewBox="0 0 30 30">
        <rect x="5" y="5" width="20" height="20" rx="2" fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="1.5" transform="rotate(45 15 15)" />
      </svg>

      {/* Small circle */}
      <svg className="geo-shape geo-float-6" style={{ top: '35%', left: '75%', width: 24, height: 24 }} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(251,191,36,0.08)" strokeWidth="1" />
      </svg>

      {/* Plus sign */}
      <svg className="geo-shape geo-float-1" style={{ top: '80%', right: '20%', width: 28, height: 28, animationDelay: '-5s' }} viewBox="0 0 28 28">
        <line x1="14" y1="4" x2="14" y2="24" stroke="rgba(249,115,22,0.1)" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke="rgba(249,115,22,0.1)" strokeWidth="1.5" />
      </svg>

      {/* Dots cluster */}
      <svg className="geo-shape geo-float-3" style={{ top: '15%', left: '45%', width: 60, height: 60, animationDelay: '-8s' }} viewBox="0 0 60 60">
        <circle cx="10" cy="10" r="2" fill="rgba(249,115,22,0.08)" />
        <circle cx="30" cy="10" r="2" fill="rgba(251,191,36,0.08)" />
        <circle cx="50" cy="10" r="2" fill="rgba(34,197,94,0.06)" />
        <circle cx="10" cy="30" r="2" fill="rgba(251,191,36,0.06)" />
        <circle cx="30" cy="30" r="2" fill="rgba(249,115,22,0.06)" />
        <circle cx="50" cy="30" r="2" fill="rgba(34,197,94,0.08)" />
      </svg>

      {variant === 'hero' && (
        <>
          <div className="gradient-blob blob-orange" style={{ width: '600px', height: '600px', top: '20%', left: '60%', opacity: 0.7 }} />
          <div className="gradient-blob blob-gold" style={{ width: '500px', height: '500px', bottom: '10%', left: '20%', opacity: 0.5 }} />

          {/* Extra hero triangle */}
          <svg className="geo-shape geo-float-2" style={{ bottom: '15%', right: '15%', width: 55, height: 55, animationDelay: '-3s' }} viewBox="0 0 55 55">
            <polygon points="27.5,5 50,45 5,45" fill="none" stroke="rgba(249,115,22,0.1)" strokeWidth="1.5" />
          </svg>

          {/* Arc */}
          <svg className="geo-shape geo-float-5" style={{ top: '8%', right: '30%', width: 70, height: 70, animationDelay: '-12s' }} viewBox="0 0 70 70">
            <path d="M10 50 Q35 5 60 50" fill="none" stroke="rgba(251,191,36,0.06)" strokeWidth="1.5" />
          </svg>
        </>
      )}
    </div>
  );
}
