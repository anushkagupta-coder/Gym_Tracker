import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";

const newSet = () => ({ weight: "", reps: "" });

export default function WorkoutEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [library, setLibrary] = useState([]);
  const [form, setForm] = useState({ name: "", date: new Date().toISOString().slice(0, 10), notes: "", exercises: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/exercises").then(({ data }) => setLibrary(data));
    if (editing) {
      api.get("/workouts").then(({ data }) => {
        const workout = data.find(w => w._id === id);
        if (workout) setForm({
          name: workout.name,
          date: new Date(workout.date).toISOString().slice(0, 10),
          notes: workout.notes || "",
          exercises: workout.exercises.map(item => ({
            exercise: item.exercise?._id,
            sets: item.sets.map(s => ({ weight: s.weight, reps: s.reps }))
          }))
        });
      });
    }
  }, [id, editing]);

  const totalVolume = useMemo(() =>
    form.exercises.reduce((sum, item) => sum + item.sets.reduce((s, set) => s + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0), 0),
    [form.exercises]
  );

  const addExercise = () => {
    const available = library.find(ex => !form.exercises.some(item => item.exercise === ex._id));
    if (!available) return;
    setForm({ ...form, exercises: [...form.exercises, { exercise: available._id, sets: [newSet()] }] });
  };

  const updateExercise = (index, value) => {
    const exercises = [...form.exercises];
    exercises[index].exercise = value;
    setForm({ ...form, exercises });
  };

  const removeExercise = (index) => {
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== index) });
  };

  const addSet = (exerciseIndex) => {
    const exercises = structuredClone(form.exercises);
    exercises[exerciseIndex].sets.push(newSet());
    setForm({ ...form, exercises });
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const exercises = structuredClone(form.exercises);
    exercises[exerciseIndex].sets[setIndex][field] = value;
    setForm({ ...form, exercises });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const exercises = structuredClone(form.exercises);
    exercises[exerciseIndex].sets.splice(setIndex, 1);
    if (!exercises[exerciseIndex].sets.length) exercises[exerciseIndex].sets.push(newSet());
    setForm({ ...form, exercises });
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        exercises: form.exercises.map(item => ({
          exercise: item.exercise,
          sets: item.sets.map(s => ({ weight: Number(s.weight), reps: Number(s.reps) }))
        }))
      };
      if (editing) await api.put(`/workouts/${id}`, payload);
      else await api.post("/workouts", payload);
      navigate("/workouts");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save workout");
    }
  };

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="editor-top"><Link to="/workouts" className="back-link"><ArrowLeft size={17} /> Back to workouts</Link><span className="live-volume">Session volume <b>{Math.round(totalVolume).toLocaleString()} kg</b></span></div>

      <form onSubmit={save}>
        <div className="editor-heading">
          <div><span className="eyebrow">{editing ? "EDIT SESSION" : "NEW SESSION"}</span><h1>{editing ? "Tune your session." : "Log the work."}</h1></div>
          <button className="primary-btn"><Save size={17} /> Save workout</button>
        </div>

        <div className="panel glass workout-meta">
          <label>Workout name<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Chest Day" /></label>
          <label>Date<input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></label>
          <label className="wide">Notes<textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="How did the session feel?" /></label>
        </div>

        <div className="editor-section-head"><div><span className="eyebrow">MOVEMENTS</span><h2>Exercises & sets</h2></div><button type="button" className="ghost-btn" onClick={addExercise} disabled={!library.length}><Plus size={16} /> Add exercise</button></div>

        <div className="session-list">
          {form.exercises.map((item, i) => (
            <motion.div className="session-card glass" key={`${i}-${item.exercise}`} layout>
              <div className="session-card-head">
                <select value={item.exercise} onChange={e => updateExercise(i, e.target.value)}>
                  {library.map(ex => <option key={ex._id} value={ex._id}>{ex.name} · {ex.muscleGroup}</option>)}
                </select>
                <button type="button" className="icon-danger" onClick={() => removeExercise(i)}><Trash2 size={17} /></button>
              </div>
              <div className="set-head"><span>SET</span><span>WEIGHT (KG)</span><span>REPS</span><span /></div>
              {item.sets.map((set, j) => (
                <div className="set-row" key={j}>
                  <span className="set-number">{j + 1}</span>
                  <input type="number" min="0" step="0.5" value={set.weight} onChange={e => updateSet(i, j, "weight", e.target.value)} placeholder="60" required />
                  <input type="number" min="1" value={set.reps} onChange={e => updateSet(i, j, "reps", e.target.value)} placeholder="10" required />
                  <button type="button" className="set-delete" onClick={() => removeSet(i, j)}><Trash2 size={15} /></button>
                </div>
              ))}
              <button type="button" className="add-set" onClick={() => addSet(i)}><Plus size={15} /> Add set</button>
            </motion.div>
          ))}
          {!form.exercises.length && <div className="dropzone" onClick={addExercise}><Plus size={24} /><b>Add your first exercise</b><span>Then add as many sets as you need.</span></div>}
        </div>

        {error && <div className="form-error page-error">{error}</div>}
      </form>
    </motion.div>
  );
}
