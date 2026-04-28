import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

function IconBase({ children, className = "", title = "Icon" }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      {children}
    </svg>
  );
}

const Icons = {
  Shield: (props) => (
    <IconBase {...props} title="Shield">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="M9 12l2 2 4-5" />
    </IconBase>
  ),
  Clipboard: (props) => (
    <IconBase {...props} title="Clipboard">
      <path d="M9 4h6a2 2 0 0 1 2 2v1H7V6a2 2 0 0 1 2-2Z" />
      <path d="M8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2" />
      <path d="M8 12h.01M11 12h5M8 16h.01M11 16h5" />
    </IconBase>
  ),
  Users: (props) => (
    <IconBase {...props} title="Users">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconBase>
  ),
  Check: (props) => (
    <IconBase {...props} title="Check">
      <path d="M20 6 9 17l-5-5" />
    </IconBase>
  ),
  Alert: (props) => (
    <IconBase {...props} title="Alert">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </IconBase>
  ),
  LogOut: (props) => (
    <IconBase {...props} title="Logout">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </IconBase>
  ),
  File: (props) => (
    <IconBase {...props} title="File">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </IconBase>
  ),
};

const fallbackAccounts = [
  { username: "leo.meier", password: "metro2026", role: "admin", displayName: "Leo Meier" },
  { username: "juergen.wellel", password: "metro2026", role: "admin", displayName: "Juergen Wellel" },
  { username: "jordan.bradford", password: "metro2026", role: "admin", displayName: "Jordan Bradford" },
  { username: "astro.santiago", password: "trainee2026", role: "trainee", displayName: "Astro Santiago" },
  { username: "momo.abbas", password: "trainee2026", role: "trainee", displayName: "Momo Abbas" },
  { username: "test-account-jw", password: "test123", role: "trainee", displayName: "Test-Account-JW" },
];

const questions = [
  {
    id: "q1",
    category: "Aufgaben der METRO",
    type: "short",
    points: 4,
    question: "Nenne vier Problemgebiete, in denen die METRO regelmäßig Streifenfahrten durchführt.",
    expectation: "Würfel Park, Mirror Park, MD, Bennys, Paleto Bay oder East Highway bis SG.",
    keywords: ["würfel", "mirror", "md", "bennys", "paleto", "east highway", "sg"],
  },
  {
    id: "q2",
    category: "Aufgaben der METRO",
    type: "short",
    points: 5,
    question: "Welche Aufgaben übernimmt die METRO bei Raub- oder Sonderlagen rund um das Zielgebäude?",
    expectation: "Umgebung prüfen, Dächer/Häuser/Rückseiten kontrollieren, Berge beachten, bedrohte Officer sichern, Verwundete stabilisieren.",
    keywords: ["umgebung", "dächer", "häuser", "rückseite", "berge", "officer", "stabilisieren", "fernglas", "wärmebild"],
  },
  {
    id: "q3",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 3,
    question: "Nach welchem Schema wird der Funkrufname der METRO benannt?",
    expectation: "DP-DN-METRO.",
    keywords: ["dp", "dn", "metro"],
  },
  {
    id: "q4",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 5,
    question: "Nenne fünf zentrale Regeln zum Verhalten im Einsatz.",
    expectation: "Auf Einsatzleitung hören, durchdacht handeln, in Bewegung bleiben, nicht aus zweiter Reihe schießen, Taser als erste Wahl, so gewaltlos wie möglich handeln.",
    keywords: ["einsatzleitung", "durchdacht", "bewegung", "zweite reihe", "taser", "gewaltlos", "vorgesetzten", "teamleitung"],
  },
  {
    id: "q5",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 4,
    question: "Wann darf eine Langwaffe getragen oder geführt werden?",
    expectation: "Mindestens ab Metro-Officer; Nutzung/Freigabe abhängig von Einsatzleitung oder High-Staff Command.",
    keywords: ["metro-officer", "officer", "freigabe", "einsatzleitung", "high-staff", "langwaffe"],
  },
  {
    id: "q6",
    category: "Ausrüstung & Fahrzeuge",
    type: "short",
    points: 4,
    question: "Welche Grundregeln gelten für Dienstfahrzeuge der METRO?",
    expectation: "Fahrzeuge marked führen, abgeschlossen halten, nur nach Fahrzeugordnung modifizieren, keine Karosserie-Veränderungen, Ausnahmen nur mit Genehmigung.",
    keywords: ["marked", "abgeschlossen", "fahrzeugordnung", "modifiziert", "karosserie", "genehmigung", "leitung"],
  },
  {
    id: "q7",
    category: "Konvoi-Schutz",
    type: "short",
    points: 5,
    question: "Beschreibe einen sinnvollen Aufbau für einen METRO-Konvoi.",
    expectation: "Späherfahrzeug/Helikopter, Leitfahrzeug, Schutzfahrzeug vor Transport, zwei Schutzfahrzeuge hinter Transport/Kolonne.",
    keywords: ["späher", "hubschrauber", "leitfahrzeug", "schutzfahrzeug", "vor", "hinter", "route", "kolonne"],
  },
  {
    id: "q8",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 4,
    question: "Was muss bei Verlust von Ausrüstung getan werden und was gilt bei Missbrauch der Ausrüstung?",
    expectation: "Verlust sofort melden; Missbrauch kann mit sofortigem Ausschluss/Rauswurf bestraft werden.",
    keywords: ["verlust", "sofort", "melden", "missbrauch", "rauswurf", "ausschluss"],
  },
  {
    id: "q9",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 4,
    question: "Wann darf die Maskierung getragen werden und wann endet der Einsatz laut Vorschrift?",
    expectation: "Maskierung nur bei Einsätzen; Einsatz endet mit Verlassen des Zellentrakts nach erfolgreicher Inhaftierung aller Tatverdächtigen.",
    keywords: ["maskierung", "einsatz", "zellentrakt", "inhaftierung", "tatverdächtigen", "beendet"],
  },
  {
    id: "q10",
    category: "Dienstvorschriften METRO",
    type: "short",
    points: 4,
    question: "Welche Grundregel gilt für Streifen, Fahrten und Flüge innerhalb der METRO?",
    expectation: "Niemals alleine; immer mindestens zu zweit fahren, fliegen oder operieren.",
    keywords: ["niemals alleine", "mindestens zu zweit", "zweit", "fahren", "fliegen", "streife"],
  },
  {
    id: "q11",
    category: "Personenschutz",
    type: "short",
    points: 5,
    question: "Was ist beim Personenschutz die höchste Priorität und wie wird bei Gefahren durch Zivilisten vorgegangen?",
    expectation: "Sicherheit der Zielperson hat höchste Priorität. Vorgehen: Warnung, Taser ziehen + Warnung, sofortige Festnahme.",
    keywords: ["zielperson", "priorität", "warnung", "taser", "festnahme", "sicherheit"],
  },
  {
    id: "q12",
    category: "Dokumentation",
    type: "short",
    points: 5,
    question: "Was muss nach einer Festnahme im SG bzw. in der Ablage dokumentiert werden?",
    expectation: "Personalien, Dokumente, Fotos, Abgenommenes, TV-Ort und geordnete Ablage pro TV; Haftzeit und Strafgeld nach Akten-Schreiber.",
    keywords: ["personalien", "dokumente", "fotos", "abgenommen", "tv", "ablage", "haftzeit", "strafgeld"],
  },
  {
    id: "q13",
    category: "Situation",
    type: "long",
    points: 8,
    question: "Situation: Bei einem Ladenraub meldet die erste Einheit Schüsse aus unbekannter Richtung. Du bist METRO-Trainee und kommst mit deinem Partner an. Wie gehst du taktisch vor?",
    expectation: "Nicht alleine vorgehen, Lagebild über Funk, Umgebung/Dächer/Rückseiten prüfen, Deckung nutzen, Einsatzleitung folgen, bedrohte Officer sichern, keine hektischen Einzelaktionen.",
    keywords: ["nicht alleine", "partner", "funk", "lage", "dächer", "rückseite", "deckung", "einsatzleitung", "officer", "sichern"],
  },
  {
    id: "q14",
    category: "Situation",
    type: "long",
    points: 8,
    question: "Situation: Während eines Events im Noble Beach Restaurant entsteht eine Schlägerei mit mehreren Beteiligten. Welche Maßnahmen sind angemessen?",
    expectation: "Crowd-Control, klare Ansprache, Trennung der Beteiligten, Deeskalation, Unterstützung anfordern, Gefahrenbereich sichern, ggf. Festnahmen im Rahmen der Befugnisse.",
    keywords: ["crowd", "control", "ansprache", "trennen", "deeskalation", "unterstützung", "sichern", "festnahme", "befugnisse"],
  },
  {
    id: "q15",
    category: "Situation",
    type: "long",
    points: 8,
    question: "Situation: Ein Officer liegt verletzt in der Schusslinie. Welche Maßnahmen sind als METRO sinnvoll und was ist zu vermeiden?",
    expectation: "Nicht hektisch alleine reinlaufen; Deckung, Absprache, bedrohten Officer aus Schusslinie holen, Stabilisierung, Medic informieren, Funkdisziplin.",
    keywords: ["deckung", "absprache", "schusslinie", "stabilisieren", "medic", "funk", "nicht alleine", "officer", "sichern"],
  },
  {
    id: "q16",
    category: "Situation",
    type: "long",
    points: 8,
    question: "Situation: Du bist der einzige freie METRO-Officer im Dienst. Wie verhältst du dich laut allgemeiner Vorschrift?",
    expectation: "Mit anderen Officers Streife fahren und ein marked Fahrzeug nutzen; nicht alleine als METRO auftreten.",
    keywords: ["andere officer", "streife", "marked", "fahrzeug", "nicht alleine", "einziger", "frei"],
  },
  {
    id: "q17",
    category: "LSPD Dienstvorschrift",
    type: "long",
    points: 6,
    question: "Erkläre, warum ein Officer auch als METRO-Mitglied weiterhin nach LSPD-Dienstvorschrift und gesetzlichen Vorgaben handeln muss.",
    expectation: "METRO ist Teil des LSPD/SAPD, keine Sonderrolle außerhalb der Regeln, Schutz von Kollegen/Zivilisten, rechtssichere Maßnahmen und saubere Dokumentation.",
    keywords: ["lspd", "sapd", "gesetze", "dienstvorschrift", "regeln", "zivilisten", "dokumentation", "recht"],
  },
  {
    id: "q18",
    category: "LSPD Dienstvorschrift",
    type: "short",
    points: 5,
    question: "Warum sind Deeskalation, Verhältnismäßigkeit und saubere Kommunikation im Polizeidienst wichtig?",
    expectation: "Sie schützen Zivilisten und Officers, verhindern unnötige Gewalt, machen Maßnahmen nachvollziehbar und sichern professionelles Auftreten.",
    keywords: ["deeskalation", "verhältnismäßigkeit", "kommunikation", "zivilisten", "officer", "gewalt", "professionell", "nachvollziehbar"],
  },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function hashPassword(password, salt) {
  const input = `${salt}:${password}`;
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSalt() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function normalizeUsername(username = "") {
  return username.trim().toLowerCase();
}

async function loginAccount(username, password) {
  const normalized = normalizeUsername(username);
  if (!supabase) {
    const account = fallbackAccounts.find((a) => a.username === normalized && a.password === password.trim());
    if (!account) throw new Error("Ungültige Zugangsdaten.");
    return account;
  }

  const { data, error } = await supabase
    .from("metro_users")
    .select("*")
    .eq("username", normalized)
    .single();

  if (error || !data) throw new Error("Ungültige Zugangsdaten.");
  if (data.is_active === false) throw new Error("Dieser Account ist deaktiviert.");

  const passwordHash = await hashPassword(password, data.salt);
  if (passwordHash !== data.password_hash) throw new Error("Ungültige Zugangsdaten.");

  return {
    username: data.username,
    role: data.role,
    displayName: data.display_name,
  };
}

async function registerAccount({ username, displayName, password }) {
  const normalized = normalizeUsername(username);
  if (!normalized || !displayName.trim() || password.length < 6) {
    throw new Error("Benutzername, Anzeigename und Passwort mit mindestens 6 Zeichen sind erforderlich.");
  }
  if (!supabase) throw new Error("Registrierung benötigt ein aktives Backend.");

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const { error } = await supabase.from("metro_users").insert({
    username: normalized,
    display_name: displayName.trim(),
    role: "trainee",
    password_hash: passwordHash,
    salt,
    is_active: true,
  });
  if (error) {
    if (String(error.message || "").includes("duplicate")) throw new Error("Dieser Benutzername ist bereits vergeben.");
    throw error;
  }
}

async function changePassword(username, currentPassword, newPassword) {
  const normalized = normalizeUsername(username);
  if (newPassword.length < 6) throw new Error("Das neue Passwort muss mindestens 6 Zeichen haben.");
  if (!supabase) throw new Error("Passwortänderung benötigt ein aktives Backend.");

  const account = await loginAccount(normalized, currentPassword);
  if (!account) throw new Error("Aktuelles Passwort ist falsch.");

  const salt = createSalt();
  const passwordHash = await hashPassword(newPassword, salt);
  const { error } = await supabase
    .from("metro_users")
    .update({ password_hash: passwordHash, salt })
    .eq("username", normalized);
  if (error) throw error;
}

function mapDbResult(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    submittedAt: row.submitted_at,
    status: row.status,
    answers: row.answers || {},
    grading: row.grading || {},
    attempt: row.attempt || 1,
    comment: row.comment || "",
  };
}

function mapClientResult(entry) {
  return {
    id: entry.id,
    username: entry.username,
    display_name: entry.displayName,
    submitted_at: entry.submittedAt,
    status: entry.status,
    answers: entry.answers || {},
    grading: entry.grading || {},
    attempt: entry.attempt || 1,
    comment: entry.comment || "",
  };
}

function getLocalResults() {
  try {
    return JSON.parse(localStorage.getItem("metro-trainee-results") || "[]");
  } catch {
    return [];
  }
}

function saveLocalResults(results) {
  localStorage.setItem("metro-trainee-results", JSON.stringify(results));
}

async function fetchResults() {
  if (!supabase) return getLocalResults();
  const { data, error } = await supabase
    .from("metro_trainee_results")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDbResult);
}

async function saveResult(entry) {
  if (!supabase) {
    const current = getLocalResults();
    saveLocalResults([entry, ...current]);
    return;
  }
  const { error } = await supabase.from("metro_trainee_results").insert(mapClientResult(entry));
  if (error) throw error;
}

async function replaceResult(entry) {
  if (!supabase) {
    const current = getLocalResults().map((r) => (r.id === entry.id ? entry : r));
    saveLocalResults(current);
    return;
  }
  const { error } = await supabase.from("metro_trainee_results").update(mapClientResult(entry)).eq("id", entry.id);
  if (error) throw error;
}

async function deleteResultById(id) {
  if (!supabase) {
    saveLocalResults(getLocalResults().filter((r) => r.id !== id));
    return;
  }
  const { error } = await supabase.from("metro_trainee_results").delete().eq("id", id);
  if (error) throw error;
}

async function deleteAllResults() {
  if (!supabase) {
    saveLocalResults([]);
    return;
  }
  const { error } = await supabase.from("metro_trainee_results").delete().neq("id", "");
  if (error) throw error;
}

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

function keywordMatches(answer, keywords = []) {
  const normalizedAnswer = normalizeText(answer);
  return keywords.filter((keyword) => normalizedAnswer.includes(normalizeText(keyword))).length;
}

function autoGradeAnswer(question, answer) {
  if (!answer || answer.trim().length < 3) return 0;
  const matches = keywordMatches(answer, question.keywords || []);
  const keywordCount = question.keywords?.length || 1;
  const needed = Math.max(1, Math.min(keywordCount, Math.ceil(keywordCount * 0.65)));
  const raw = Math.round((matches / needed) * question.points);
  return Math.max(0, Math.min(question.points, raw));
}

function autoGradeTest(answers) {
  const grading = {};
  questions.forEach((question) => {
    const points = autoGradeAnswer(question, answers[question.id] || "");
    grading[question.id] = {
      points,
      note: points >= question.points ? "Automatisch als korrekt erkannt." : "Automatisch als unvollständig/falsch markiert. Bitte durch Leitung prüfen.",
      auto: true,
    };
  });
  return grading;
}

function getTotalPoints(grading = {}) {
  return questions.reduce((sum, q) => sum + Number(grading?.[q.id]?.points || 0), 0);
}

function getMaxPoints() {
  return questions.reduce((sum, q) => sum + q.points, 0);
}

function getPassedStatus(total, max) {
  return total >= max * 0.8 ? "Bestanden" : "Nicht bestanden";
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <div className={classNames("rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur", className)}>{children}</div>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400",
    secondary: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    danger: "border border-red-300/20 bg-red-500/10 text-red-100 hover:bg-red-500/20",
  };
  return (
    <button className={classNames("rounded-xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "register") {
        if (password !== passwordRepeat) throw new Error("Die Passwörter stimmen nicht überein.");
        await registerAccount({ username, displayName, password });
        setSuccess("Account wurde erstellt. Du kannst dich jetzt einloggen.");
        setMode("login");
        setPassword("");
        setPasswordRepeat("");
        return;
      }
      const account = await loginAccount(username, password);
      onLogin(account);
    } catch (err) {
      setError(err.message || "Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <section className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-blue-300">LSPD METRO Division</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Trainee<br /><span className="bg-gradient-to-r from-blue-200 via-white to-slate-400 bg-clip-text text-transparent">Assessment</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Internes Testportal für METRO-Trainees. Accounts werden über das Backend verwaltet. Passwörter können nach dem Login geändert werden.
          </p>
        </div>
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white"><Icons.Shield /></div>
            <div>
              <h2 className="text-2xl font-black">{mode === "login" ? "Login" : "Registrieren"}</h2>
              <p className="text-sm text-slate-400">{mode === "login" ? "Trainee- oder Leitungsaccount" : "Neuen Trainee-Account erstellen"}</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-300">Benutzername</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400" placeholder="z. B. astro.santiago" />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-sm font-semibold text-slate-300">Anzeigename</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400" placeholder="z. B. Astro Santiago" />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-300">Passwort</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400" />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-sm font-semibold text-slate-300">Passwort wiederholen</label>
                <input type="password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400" />
              </div>
            )}
            {error && <p className="rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}
            <Button type="submit" disabled={loading || !supabase && mode === "register"} className="w-full">{loading ? "Bitte warten..." : mode === "login" ? "Einloggen" : "Account erstellen"}</Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" variant={mode === "login" ? "primary" : "secondary"} onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="px-4 py-2">Login</Button>
            <Button type="button" variant={mode === "register" ? "primary" : "secondary"} onClick={() => { setMode("register"); setError(""); setSuccess(""); }} className="px-4 py-2">Registrieren</Button>
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-slate-400">
            Speicherung: <span className="text-white">{supabase ? "Backend aktiv" : "lokaler Fallback"}</span>. Registrierung funktioniert nur mit aktivem Backend.
          </div>
        </Card>
      </section>
    </main>
  );
}

function AccountSettings({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== newPasswordRepeat) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true);
    try {
      await changePassword(user.username, currentPassword, newPassword);
      setMessage("Passwort wurde erfolgreich geändert.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
    } catch (err) {
      setError(err.message || "Passwort konnte nicht geändert werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200"><Icons.Shield /></div>
        <div>
          <h3 className="text-xl font-black text-white">Account</h3>
          <p className="text-sm text-slate-400">Eingeloggt als {user.displayName} · {user.username}</p>
        </div>
      </div>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Aktuelles Passwort" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Neues Passwort" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400" />
        <input type="password" value={newPasswordRepeat} onChange={(e) => setNewPasswordRepeat(e.target.value)} placeholder="Neues Passwort wiederholen" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400" />
        <div className="md:col-span-3 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading || !supabase}>{loading ? "Speichern..." : "Passwort ändern"}</Button>
          {!supabase && <p className="text-sm text-red-300">Passwortänderung benötigt ein aktives Backend.</p>}
          {message && <p className="text-sm text-emerald-300">{message}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
      </form>
    </Card>
  );
}

function TestView({ user }) {
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAttempts() {
      try {
        const results = await fetchResults();
        if (active) setPreviousAttempts(results.filter((r) => r.username === user.username));
      } catch (error) {
        if (active) setSaveError(error.message || "Fehler beim Laden der Abgaben.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadAttempts();
    return () => {
      active = false;
    };
  }, [user.username]);

  const maxPoints = getMaxPoints();

  function updateAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function submitTest() {
    setSaveError("");
    try {
      const results = await fetchResults();
      const userAttempts = results.filter((r) => r.username === user.username);
      const autoGrading = autoGradeTest(answers);
      const total = getTotalPoints(autoGrading);
      const max = getMaxPoints();
      const entry = {
        id: `${user.username}-${Date.now()}`,
        username: user.username,
        displayName: user.displayName,
        submittedAt: new Date().toISOString(),
        status: getPassedStatus(total, max),
        answers,
        grading: autoGrading,
        attempt: userAttempts.length + 1,
        comment: "Automatische Erstbewertung. Leitung kann Punkte, Status und Kommentare nachträglich ändern.",
      };
      await saveResult(entry);
      setPreviousAttempts([entry, ...userAttempts]);
      setSubmitted(true);
    } catch (error) {
      setSaveError(error.message || "Fehler beim Speichern der Abgabe.");
    }
  }

  return (
    <div>
      <AccountSettings user={user} />
      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Prüfung</p>
          <h2 className="text-3xl font-black text-white">METRO Trainee Test</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Beantworte alle Fragen so genau wie möglich. Situationsfragen werden nach taktischem Vorgehen, Regelkenntnis und sauberer Begründung bewertet. Mehrere Versuche sind möglich und werden einzeln gespeichert.</p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-white">Punkte</h3>
          <p className="mt-3 text-4xl font-black text-white">{maxPoints}</p>
          <p className="text-sm text-slate-400">maximal erreichbar</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">Bestehensgrenze: 80% · automatische Stichwort-Bewertung</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">Bisherige Versuche: {loading ? "lädt..." : previousAttempts.length}</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">Speicherung: {supabase ? "Backend aktiv" : "lokaler Fallback"}</p>
        </Card>
      </div>

      <div className="space-y-5">
        {questions.map((q, index) => (
          <Card key={q.id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">{q.category}</p>
                <h3 className="mt-2 text-xl font-black text-white">Frage {index + 1}</h3>
              </div>
              <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-bold text-blue-200">{q.points} Punkte</span>
            </div>
            <p className="text-sm leading-7 text-slate-200">{q.question}</p>
            <textarea
              value={answers[q.id] || ""}
              disabled={submitted}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
              rows={q.type === "long" ? 6 : 4}
              className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 disabled:opacity-70"
              placeholder="Antwort eintragen..."
            />
          </Card>
        ))}
      </div>

      {saveError && <p className="mt-5 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{saveError}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={submitTest} disabled={submitted || loading}>{submitted ? "Abgabe gespeichert" : "Test einreichen"}</Button>
        {submitted && <Button variant="secondary" onClick={() => { setAnswers({}); setSubmitted(false); }}>Neuen Versuch starten</Button>}
        {submitted && <p className="text-sm text-emerald-300">Antworten wurden gespeichert. Du kannst bei Bedarf einen weiteren Versuch starten.</p>}
      </div>
    </div>
  );
}

function AdminView() {
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadResults() {
      try {
        const loaded = await fetchResults();
        if (!active) return;
        setResults(loaded);
        setSelectedId(loaded[0]?.id || "");
      } catch (error) {
        if (active) setAdminError(error.message || "Fehler beim Laden der Ergebnisse.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadResults();
    return () => {
      active = false;
    };
  }, []);
  const selected = results.find((r) => r.id === selectedId);
  const maxPoints = getMaxPoints();

  async function updateGrade(questionId, field, value) {
    const next = results.map((r) => {
      if (r.id !== selectedId) return r;
      const grading = {
        ...r.grading,
        [questionId]: {
          ...(r.grading?.[questionId] || {}),
          [field]: field === "points" ? Number(value) : value,
        },
      };
      return { ...r, grading, status: "In Bewertung" };
    });
    setResults(next);
    const updated = next.find((r) => r.id === selectedId);
    try {
      await replaceResult(updated);
    } catch (error) {
      setAdminError(error.message || "Fehler beim Speichern der Bewertung.");
    }
  }

  async function updateFinalComment(value) {
    const next = results.map((r) => (r.id === selectedId ? { ...r, comment: value } : r));
    setResults(next);
    try {
      await replaceResult(next.find((r) => r.id === selectedId));
    } catch (error) {
      setAdminError(error.message || "Fehler beim Speichern des Kommentars.");
    }
  }

  async function updateStatus(value) {
    const next = results.map((r) => (r.id === selectedId ? { ...r, status: value } : r));
    setResults(next);
    try {
      await replaceResult(next.find((r) => r.id === selectedId));
    } catch (error) {
      setAdminError(error.message || "Fehler beim Speichern des Status.");
    }
  }

  async function deleteResult(resultId) {
    if (!window.confirm("Diese Abgabe wirklich löschen?")) return;
    try {
      await deleteResultById(resultId);
      const next = results.filter((r) => r.id !== resultId);
      setResults(next);
      if (selectedId === resultId) setSelectedId(next[0]?.id || "");
    } catch (error) {
      setAdminError(error.message || "Fehler beim Löschen der Abgabe.");
    }
  }

  async function finalize() {
    const next = results.map((r) => {
      if (r.id !== selectedId) return r;
      const total = getTotalPoints(r.grading);
      return { ...r, status: getPassedStatus(total, maxPoints) };
    });
    setResults(next);
    try {
      await replaceResult(next.find((r) => r.id === selectedId));
    } catch (error) {
      setAdminError(error.message || "Fehler beim Speichern des Status.");
    }
  }

  async function clearAll() {
    if (!window.confirm("Alle gespeicherten Ergebnisse wirklich löschen?")) return;
    try {
      await deleteAllResults();
      setResults([]);
      setSelectedId("");
    } catch (error) {
      setAdminError(error.message || "Fehler beim Löschen aller Ergebnisse.");
    }
  }

  const total = selected ? getTotalPoints(selected.grading) : 0;
  const percentage = maxPoints > 0 ? Math.round((total / maxPoints) * 100) : 0;

  return (
    <div>
      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Leitung</p>
          <h2 className="text-3xl font-black text-white">Bewertungsübersicht</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Hier können eingereichte Tests eingesehen, bepunktet, korrigiert und final bewertet werden.</p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-white">Ergebnisse</h3>
          <p className="mt-3 text-4xl font-black text-white">{results.length}</p>
          <p className="text-sm text-slate-400">gespeicherte Abgaben</p>
        </Card>
      </div>

      {adminError && <p className="mb-5 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{adminError}</p>}
      {loading ? (
        <Card>
          <p className="text-slate-300">Ergebnisse werden geladen...</p>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <p className="text-slate-300">Noch keine Testabgaben vorhanden.</p>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white">Abgaben</h3>
              <Button variant="danger" onClick={clearAll} className="px-3 py-2 text-xs">Alle löschen</Button>
            </div>
            <div className="space-y-3">
              {results.map((result) => {
                const score = getTotalPoints(result.grading);
                const percent = maxPoints > 0 ? Math.round((score / maxPoints) * 100) : 0;
                const active = result.id === selectedId;
                return (
                  <button
                    key={result.id}
                    onClick={() => setSelectedId(result.id)}
                    className={classNames("w-full rounded-xl border p-4 text-left transition", active ? "border-blue-400 bg-blue-500/15" : "border-white/10 bg-black/20 hover:bg-white/10")}
                  >
                    <p className="font-bold text-white">{result.displayName}</p>
                    <p className="mt-1 text-xs text-slate-400">Versuch {result.attempt || "—"} · {new Date(result.submittedAt).toLocaleString("de-DE")}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className={classNames("rounded-full px-2 py-1", result.status === "Bestanden" ? "bg-emerald-500/15 text-emerald-300" : result.status === "Nicht bestanden" ? "bg-red-500/15 text-red-300" : "bg-white/10 text-slate-300")}>{result.status}</span>
                      <span className={classNames("font-bold", percent >= 80 ? "text-emerald-300" : "text-red-300")}>{score}/{maxPoints} Punkte · {percent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {selected && (
            <Card>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white">{selected.displayName}</h3>
                  <p className="mt-1 text-sm text-slate-400">Status: {selected.status} · Versuch {selected.attempt || "—"}</p>
                </div>
                <div className="rounded-2xl bg-blue-500/15 px-5 py-3 text-right">
                  <p className="text-2xl font-black text-white">{total}/{maxPoints}</p>
                  <p className="text-xs text-blue-200">Punkte · {percentage}%</p>
                </div>
              </div>

              <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
                >
                  <option>Bestanden</option>
                  <option>Nicht bestanden</option>
                  <option>In Bewertung</option>
                  <option>Nachprüfung</option>
                </select>
                <Button variant="danger" onClick={() => deleteResult(selected.id)}>Abgabe löschen</Button>
              </div>

              <div className="space-y-5">
                {questions.map((q, index) => (
                  <div key={q.id} className={classNames("rounded-2xl border p-4", Number(selected.grading?.[q.id]?.points || 0) < q.points ? "border-red-400/40 bg-red-500/10" : "border-white/10 bg-black/20")}>
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">{q.category}</p>
                        <h4 className="mt-1 font-bold text-white">Frage {index + 1}</h4>
                      </div>
                      <span className={classNames("rounded-full px-3 py-1 text-xs", Number(selected.grading?.[q.id]?.points || 0) < q.points ? "bg-red-500/20 text-red-200" : "bg-emerald-500/15 text-emerald-300")}>{Number(selected.grading?.[q.id]?.points || 0)}/{q.points}</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{q.question}</p>
                    <div className="mt-3 rounded-xl bg-white/[0.04] p-3 text-sm leading-6 text-slate-200">{selected.answers?.[q.id] || "Keine Antwort."}</div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">Erwartung: {q.expectation}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-[140px_1fr]">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Punkte</label>
                        <input
                          type="number"
                          min="0"
                          max={q.points}
                          value={selected.grading?.[q.id]?.points ?? ""}
                          onChange={(e) => updateGrade(q.id, "points", e.target.value)}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Korrektur / Kommentar</label>
                        <input
                          value={selected.grading?.[q.id]?.note || ""}
                          onChange={(e) => updateGrade(q.id, "note", e.target.value)}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-blue-400"
                          placeholder="z. B. vollständig, ungenau, wichtige Punkte fehlen..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Abschlusskommentar</label>
                <textarea value={selected.comment || ""} onChange={(e) => updateFinalComment(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-400" />
              </div>
              <div className="mt-5 flex gap-3">
                <Button onClick={finalize}>Status automatisch neu berechnen</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function MetroTraineeTestWebsite() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("test");

  if (!user) return <Login onLogin={setUser} />;

  const isAdmin = user.role === "admin";
  const content = isAdmin && activeTab === "admin" ? <AdminView /> : <TestView user={user} />;

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-8 md:px-8">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30"><Icons.Shield /></div>
            <div>
              <p className="text-sm font-bold tracking-[0.25em] text-slate-300">LSPD METRO</p>
              <p className="text-lg font-black tracking-tight">Trainee Assessment</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={activeTab === "test" ? "primary" : "secondary"} onClick={() => setActiveTab("test")} className="px-4 py-2">Test</Button>
            {isAdmin && <Button variant={activeTab === "admin" ? "primary" : "secondary"} onClick={() => setActiveTab("admin")} className="px-4 py-2">Leitung</Button>}
            <Button variant="secondary" onClick={() => setUser(null)} className="px-4 py-2"><Icons.LogOut className="h-4 w-4" /></Button>
          </div>
        </nav>

        <header className="mb-10">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-blue-300">Interne Prüfung</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            METRO Trainee<br /><span className="bg-gradient-to-r from-blue-200 via-white to-slate-400 bg-clip-text text-transparent">Testportal</span>
          </motion.h1>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            {content}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-20 border-t border-white/10 py-8 text-center text-sm text-slate-500">
          © Juergen Wellel · Los Santos Police Department · METRO Division
        </footer>
      </section>
    </main>
  );
}
