import { gradientFor } from "../utils/ui";

export default function Avatar({ name = "?", size = 48, radius = 14, ring = false }) {
  return (
    <span
      className="cp-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.round(size * 0.4),
        background: gradientFor(name),
        boxShadow: ring ? "0 0 0 4px rgba(255,255,255,.3)" : undefined,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}