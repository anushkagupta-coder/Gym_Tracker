import { Dumbbell } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <div className="brand">
      <span className="brand-mark"><Dumbbell size={19} /></span>
      {!compact && (
        <span className="brand-copy">
          <b>GYM</b><strong>FORGE</strong>
        </span>
      )}
    </div>
  );
}
