/**
 * Niemeyer arch · curva sweeping decorativa.
 * Inspirada nas linhas curvas do Palácio do Planalto e da catedral de Brasília.
 */
export function Arch({
  width = 240,
  height = 80,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d={`M 0,${height} C ${width * 0.25},${height * 0.05} ${width * 0.75},${height * 0.05} ${width},${height}`}
        className="v2-arch"
      />
    </svg>
  );
}

/** Curva mais aberta · linha quase horizontal com leve rebaixo central. */
export function SoftArch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" className={className} aria-hidden preserveAspectRatio="none">
      <path d="M 0,20 C 100,40 300,40 400,20" className="v2-arch" strokeWidth={1.2} />
    </svg>
  );
}
