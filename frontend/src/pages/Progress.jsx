import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Gauge, Trophy, Weight } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";

export default function Progress() {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/exercises").then(({ data }) => {
      setExercises(data);
      if (data[0]) setSelected(data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (selected) api.get(`/progress/${selected}`).then(({ data }) => setData(data));
  }, [selected]);

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader eyebrow="PERFORMANCE LAB" title="Progress" description="See what changed from one session to the next." />

      <div className="progress-picker glass">
        <div><span className="eyebrow">SELECT MOVEMENT</span><h3>What are we comparing?</h3></div>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {exercises.map(ex => <option key={ex._id} value={ex._id}>{ex.name}</option>)}
        </select>
      </div>

      {data && (
        <>
          <div className="progress-top">
            <div className={`trend-card glass ${data.trend.toLowerCase()}`}>
              {data.trend === "Improved" ? <ArrowUp /> : data.trend === "Decreased" ? <ArrowDown /> : <ArrowRight />}
              <div><span>SESSION TREND</span><strong>{data.trend}</strong><small>vs previous session</small></div>
            </div>
            <div className="metric-mini glass"><Weight /><span>Best weight</span><b>{data.bestWeight} kg</b></div>
            <div className="metric-mini glass"><Gauge /><span>Best reps</span><b>{data.bestReps}</b></div>
            <div className="metric-mini glass"><Trophy /><span>Best estimated 1RM</span><b>{Math.max(...(data.history.map(x => x.estimated1RM) || [0])).toFixed(1)} kg</b></div>
          </div>

          <div className="progress-grid">
            <div className="panel glass chart-panel">
              <div className="panel-heading"><div><span className="eyebrow">ESTIMATED 1RM</span><h2>{data.exercise.name}</h2></div></div>
              <div className="chart-wrap tall">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.history}>
                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} />
                    <YAxis />
                    <Tooltip contentStyle={{ background: "#171016", border: "1px solid #4B2639", borderRadius: 12 }} labelFormatter={(d) => new Date(d).toLocaleDateString()} />
                    <Line type="monotone" dataKey="estimated1RM" stroke="#E75480" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel glass comparison">
              <div className="panel-heading"><div><span className="eyebrow">SESSION SNAPSHOT</span><h2>Then vs now</h2></div></div>
              <div className="compare-row"><span>Previous</span><b>{data.previous ? `${data.previous.bestWeight} kg × ${data.previous.bestReps}` : "—"}</b></div>
              <div className="compare-row current"><span>Current</span><b>{data.current ? `${data.current.bestWeight} kg × ${data.current.bestReps}` : "—"}</b></div>
              <div className="formula-box">1RM = weight × (1 + reps / 30)<br /><strong>{data.current?.estimated1RM ?? "—"} kg</strong> estimated current 1RM</div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
