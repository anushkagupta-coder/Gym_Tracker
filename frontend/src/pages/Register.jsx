import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
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
          <span className="eyebrow">START YOUR LOG</span>
          <h1>Build your streak.</h1>
          <p>Track every set, see every improvement.</p>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>Name <span className="input-wrap"><UserRound size={17} /><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" /></span></label>
          <label>Email <span className="input-wrap"><Mail size={17} /><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" /></span></label>
          <label>Password <span className="input-wrap"><LockKeyhole size={17} /><input type="password" minLength={6} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Minimum 6 characters" /></span></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn full" disabled={loading}>{loading ? "Creating..." : <>Create account <ArrowRight size={17} /></>}</button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
