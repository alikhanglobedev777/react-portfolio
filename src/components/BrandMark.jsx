import "../styles/BrandMark.css";

export default function BrandMark({ compact = false, className = "" }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <svg className="brand-mark__glyph" viewBox="0 0 82 48" role="img" focusable="false">
        <path className="brand-mark__stroke brand-mark__stroke--m" d="M5 42V7l15 21L35 7v35" />
        <path className="brand-mark__stroke brand-mark__stroke--a" d="M43 42 59 6l17 36M49 29h21" />
        <circle className="brand-mark__node" cx="59" cy="6" r="2.6" />
      </svg>
      {!compact && (
        <span className="brand-mark__wordmark">
          <strong>MUHAMMAD ALI</strong>
          <small>FULL-STACK / CREATIVE</small>
        </span>
      )}
    </span>
  );
}
