import "../styles/BrandMark.css";

export default function BrandMark({ compact = false, className = "" }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <svg className="brand-mark__glyph" viewBox="0 0 72 48" role="img" focusable="false">
        <path className="brand-mark__stroke brand-mark__stroke--a" d="M5 42 22 6l16 36M12 29h20" />
        <path className="brand-mark__stroke brand-mark__stroke--k" d="M42 6v36M42 26 63 6M42 26l23 16" />
        <circle className="brand-mark__node" cx="42" cy="26" r="2.6" />
      </svg>
      {!compact && (
        <span className="brand-mark__wordmark">
          <strong>ALI KHAN</strong>
          <small>FULL-STACK / CREATIVE</small>
        </span>
      )}
    </span>
  );
}
