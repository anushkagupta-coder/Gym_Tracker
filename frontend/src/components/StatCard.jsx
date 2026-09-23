import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <motion.div
      className="stat-card glass"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="stat-icon"><Icon size={19} /></div>
      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </motion.div>
  );
}
