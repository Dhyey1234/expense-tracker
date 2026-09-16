// Deterministic color assignment so the same category always renders
// the same tone, without needing a fixed category list from the backend.
const PALETTE = [
  { bg: "#e4ece9", fg: "#1f4b43" },
  { bg: "#eef0f7", fg: "#3a4a8f" },
  { bg: "#f8e9e5", fg: "#b3432f" },
  { bg: "#f6efe0", fg: "#8a6a1f" },
  { bg: "#efe7f3", fg: "#6c3f8f" },
  { bg: "#e3eff3", fg: "#256b82" },
];

function toneFor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[Math.abs(hash)];
}

function Badge({ children }) {
  const label = String(children ?? "").trim();
  const tone = label ? toneFor(label) : PALETTE[0];

  return (
    <span
      className="badge"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {label || "Uncategorized"}
    </span>
  );
}

export default Badge;
