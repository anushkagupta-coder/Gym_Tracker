import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, Dumbbell, Flame, Trophy, Weight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

const burgundy = ["#7A1E4A", "#B03060", "#E75480", "#FD8FA8", "#CAB5BD"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="loading-screen">Loading your numbers...</div>;

  const recent = stats.recent?.length ? stats.recent : [{ date: "—", volume: 0, name: "No workouts yet" }];

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        eyebrow="YOUR TRAINING HQ"
        title="Good to see you."
        description="A quick read on your training, volume and consistency."
        action={<div className="streak-pill"><Flame size={18} /> {stats.currentStreak} day streak</div>}
      />

      <section className="stats-grid">
        <StatCard icon={Activity} label="Total workouts" value={stats.totalWorkouts} hint="All time" />
        <StatCard icon={Dumbbell} label="Exercises logged" value={stats.totalExercises} hint="Across your sessions" />
        <StatCard icon={Weight} label="Total volume" value={`${Math.round(stats.totalVolume).toLocaleString()} kg`} hint="Weight × reps" />
        <StatCard icon={CalendarCheck} label="This week" value={stats.workoutsThisWeek} hint="Last 7 days" />
      </section>

      <section className="dashboard-grid">
        <div className="panel glass large-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">RECENT LOAD</span><h2>Volume trend</h2></div>
            <span className="soft-badge">Last 7 sessions</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recent}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E75480" stopOpacity={0.45}/>
                    <stop offset="100%" stopColor="#E75480" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ background: "#171016", border: "1px solid #4B2639", borderRadius: 12 }} />
                <Area type="monotone" dataKey="volume" stroke="#E75480" strokeWidth={2.5} fill="url(#volumeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-labels">
            {recent.map((item, index) => <span key={index}>{item.date?.slice(5) || "—"}</span>)}
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-heading">
            <div><span className="eyebrow">CONSISTENCY</span><h2>Streak</h2></div>
            <Trophy size={21} className="muted-icon" />
          </div>
          <div className="streak-big"><span>🔥</span><strong>{stats.currentStreak}</strong><small>current days</small></div>
          <div className="streak-best">Longest streak <b>{stats.longestStreak} days</b></div>
        </div>

        <div className="panel glass">
          <div className="panel-heading">
            <div><span className="eyebrow">TRAINING MIX</span><h2>Muscle groups</h2></div>
          </div>
          {stats.muscleDistribution?.length ? (
            <div className="donut-area">
              <ResponsiveContainer width="55%" height={190}>
                <PieChart>
                  <Pie data={stats.muscleDistribution} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={4}>
                    {stats.muscleDistribution.map((_, i) => <Cell key={i} fill={burgundy[i % burgundy.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {stats.muscleDistribution.map((item, i) => <div key={item.name}><i style={{ background: burgundy[i % burgundy.length] }} />{item.name}<b>{item.value}</b></div>)}
              </div>
            </div>
          ) : <EmptyState title="No muscle data" text="Log a workout to see your training split." />}
        </div>
      </section>
    </motion.div>
  );
}
