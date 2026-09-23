import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { exerciseLibrary } from "../data/exercises";

const blank = {
  name: "",
  muscleGroup: "",
  equipment: ""
};

export default function Exercises() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [customExercise, setCustomExercise] = useState(false);

  const load = () =>
    api.get("/exercises").then(({ data }) => setItems(data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/exercises/${editingId}`, form);
      } else {
        await api.post("/exercises", form);
      }

      setForm(blank);
      setEditingId(null);
      setCustomExercise(false);
      load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save exercise"
      );
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;

    await api.delete(`/exercises/${id}`);
    load();
  };

  const edit = (item) => {
    setEditingId(item._id);

    setForm({
      name: item.name,
      muscleGroup: item.muscleGroup,
      equipment: item.equipment
    });

    // If the saved exercise isn't in our predefined library,
    // open it as a custom exercise.
    const predefinedExercises =
      exerciseLibrary[item.muscleGroup] || [];

    setCustomExercise(
      !predefinedExercises.includes(item.name)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <PageHeader
        eyebrow="YOUR MOVEMENT LIBRARY"
        title="Exercises"
        description="Keep the movements you actually train. Clean and simple."
      />

      <div className="two-col">

        {/* ADD / EDIT EXERCISE */}
        <form
          className="panel glass form-card"
          onSubmit={submit}
        >
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                {editingId ? "EDIT MOVEMENT" : "NEW MOVEMENT"}
              </span>

              <h2>
                {editingId
                  ? "Update exercise"
                  : "Add exercise"}
              </h2>
            </div>
          </div>

          {/* MUSCLE GROUP */}
          <label>
            Muscle group

            <select
              value={form.muscleGroup}
              onChange={(e) => {
                setForm({
                  ...form,
                  muscleGroup: e.target.value,
                  name: ""
                });

                setCustomExercise(false);
              }}
              required
            >
              <option value="">
                Select muscle group
              </option>

              {Object.keys(exerciseLibrary).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>

          {/* EXERCISE NAME */}
          <label>
            Exercise name

            {customExercise ? (
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="Enter your exercise"
                required
              />
            ) : (
              <select
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                disabled={!form.muscleGroup}
                required
              >
                <option value="">
                  Select exercise
                </option>

                {(exerciseLibrary[form.muscleGroup] || []).map(
                  (exercise) => (
                    <option
                      key={exercise}
                      value={exercise}
                    >
                      {exercise}
                    </option>
                  )
                )}
              </select>
            )}
          </label>

          {/* CUSTOM EXERCISE BUTTON */}
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              setCustomExercise(!customExercise);

              setForm({
                ...form,
                name: ""
              });
            }}
          >
            {customExercise
              ? "Choose from list"
              : "+ Add custom exercise"}
          </button>

          {/* EQUIPMENT */}
          <label>
            Equipment

            <input
              value={form.equipment}
              onChange={(e) =>
                setForm({
                  ...form,
                  equipment: e.target.value
                })
              }
              placeholder="e.g. Barbell"
              required
            />
          </label>

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="button-row">
            <button className="primary-btn">
              <Plus size={17} />

              {editingId
                ? "Save changes"
                : "Add exercise"}
            </button>

            {editingId && (
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(blank);
                  setCustomExercise(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* EXERCISE LIST */}
        <div className="exercise-list">
          {items.length ? (
            items.map((item, index) => (
              <motion.div
                className="exercise-row glass"
                key={item._id}
                initial={{
                  opacity: 0,
                  x: 15
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: index * 0.04
                }}
              >
                <div className="exercise-symbol">
                  {item.name
                    .slice(0, 1)
                    .toUpperCase()}
                </div>

                <div className="exercise-info">
                  <h3>{item.name}</h3>

                  <p>
                    {item.muscleGroup}

                    <span>•</span>

                    {item.equipment}
                  </p>
                </div>

                <div className="row-actions">
                  <button
                    onClick={() => edit(item)}
                    title="Edit"
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    className="danger"
                    onClick={() => remove(item._id)}
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState
              title="Your library is empty"
              text="Add your first exercise on the left."
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}