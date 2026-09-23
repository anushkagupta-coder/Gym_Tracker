import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight, Dumbbell, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  const load = () => api.get("/workouts").then(({ data }) => setWorkouts(data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    await api.delete(`/workouts/${id}`);
    load();
  };

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        eyebrow="TRAINING LOG"
        title="Workouts"
        description="Every session is a data point. Keep the log honest."
        action={<Link className="primary-btn" to="/workouts/new"><Plus size={17} /> New workout</Link>}
      />

      <div className="workout-list">
        {workouts.length ? workouts.map((workout, index) => {
          const volume = workout.exercises.reduce((total, item) => total + item.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
          return (
            <motion.article className="workout-card glass" key={workout._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <div className="date-block">
                <span>{new Date(workout.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                <strong>{new Date(workout.date).getDate()}</strong>
                <small>{new Date(workout.date).toLocaleDateString("en-IN", { month: "short" })}</small>
              </div>
              <div className="workout-main">
                <div className="workout-title"><div><h2>{workout.name}</h2><p><CalendarDays size={14} /> {new Date(workout.date).toLocaleDateString()}</p></div><span className="volume-tag">{Math.round(volume).toLocaleString()} kg volume</span></div>
                <div className="workout-exercises">
                  {workout.exercises.slice(0, 4).map(item => <span key={item._id}><Dumbbell size={13} /> {item.exercise?.name || "Exercise"} <b>{item.sets.length}</b></span>)}
                  {workout.exercises.length > 4 && <span>+{workout.exercises.length - 4} more</span>}
                </div>
              </div>
              <div className="workout-actions">
                <Link to={`/workouts/${workout._id}`}><ChevronRight size={19} /></Link>
                <button className="icon-danger" onClick={() => remove(workout._id)}><Trash2 size={17} /></button>
              </div>
            </motion.article>
          );
        }) : <EmptyState title="No workouts yet" text="Create your first session and start building your streak." />}
      </div>
    </motion.div>
  );
}
