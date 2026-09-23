import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <motion.div className="auth-card glass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <Logo />
        <div className="auth-heading">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Ready to train?</h1>
          <p>Your numbers are waiting. Keep the streak alive.</p>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>Email <span className="input-wrap"><Mail size={17} /><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" /></span></label>
          <label>Password <span className="input-wrap"><LockKeyhole size={17} /><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" /></span></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn full" disabled={loading}>{loading ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}</button>
        </form>

        <p className="auth-footer">New here? <Link to="/register">Create your account</Link></p>
      </motion.div>
    </div>
  );
}
