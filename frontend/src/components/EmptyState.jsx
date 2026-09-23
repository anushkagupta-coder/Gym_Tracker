import { Dumbbell } from "lucide-react";

export default function EmptyState({ title, text }) {
  return (
    <div className="empty-state glass">
      <div className="empty-icon"><Dumbbell size={25} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
