import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { KeyRound, User, Lock, AlertCircle } from "lucide-react";
import { supabaseClient } from "../supabaseClient";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Fallback local auth for initial testing
    if (username === "sdstadmin" && password === "sdst2011team") {
      const fallbackAdmin = {
        username: "sdstadmin",
        first_name: "Системный",
        last_name: "Администратор",
        role: "creator",
        permissions: {
          analytics: true,
          featured: true,
          about: true,
          projects: true,
          contacts: true,
          services: true,
          history: true
        }
      };
      localStorage.setItem("sds_admin_logged_in", "true");
      localStorage.setItem("sds_current_admin", JSON.stringify(fallbackAdmin));
      navigate("/admin");
      return;
    }

    // Query sds_admins table
    try {
      const admins = await supabaseClient.fetchTable("sds_admins");
      const matched = admins.find((a: any) => a.username === username.trim().toLowerCase() && a.password === password);
      
      if (matched) {
        const defaultPerms = {
          analytics: true,
          featured: matched.role !== "limited",
          about: matched.role !== "limited",
          projects: true,
          contacts: matched.role !== "limited",
          services: true,
          history: matched.role === "creator" || matched.role === "full"
        };

        localStorage.setItem("sds_admin_logged_in", "true");
        localStorage.setItem("sds_current_admin", JSON.stringify({
          username: matched.username,
          first_name: matched.first_name,
          last_name: matched.last_name,
          role: matched.role,
          permissions: matched.permissions ? { ...defaultPerms, ...matched.permissions } : defaultPerms
        }));
        navigate("/admin");
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err: any) {
      setError("Ошибка: " + err.message);
    }
  };


  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center p-6 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0000FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#0066FF]/10 blur-[120px] pointer-events-none" />
      
      {/* Centered card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl rounded-[32px] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0000FF] to-[#0066FF] flex items-center justify-center mb-4 shadow-[0_8px_30px_rgba(0,0,255,0.4)]">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white/95 mb-1.5">STEEL DRAKE</h2>
          <p className="text-sm text-white/50 uppercase tracking-widest font-semibold">CMS CONTROL PANEL</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">Пользователь</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#0066FF] focus:bg-white/[0.06] outline-none transition-all duration-300 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-[#0066FF] focus:bg-white/[0.06] outline-none transition-all duration-300 text-base"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#0000FF] to-[#0066FF] hover:from-[#0022FF] hover:to-[#0088FF] text-white font-bold rounded-xl shadow-[0_20px_40px_rgba(0,0,255,0.25)] hover:shadow-[0_20px_40px_rgba(0,0,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-base flex items-center justify-center gap-2"
          >
            Войти в админку
          </button>
        </form>
      </motion.div>
    </div>
  );
}
