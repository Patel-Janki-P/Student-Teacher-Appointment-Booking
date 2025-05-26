// src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import SharedForm from "../components/sharedForm";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    teacherId: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const role = new URLSearchParams(useLocation().search).get("role") || "student";

  useEffect(() => {
    const fetchTeachers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "teacher"), where("approved", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(data);
    };

    if (role === "student") fetchTeachers();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      const userData = {
        email: form.email,
        fullName: form.fullName,
        department: form.department,
        role,
        approved: false,
      };

      if (role === "student") {
        userData.teacherId = form.teacherId;
      }

      await setDoc(doc(db, "users", user.uid), userData);

      setMessage("Registration submitted. Please wait for approval.");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Registration error:", err.message);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 capitalize bg-slate-900 text-white p-2 rounded-xl text-center">
        Register as {role}
      </h2>
        <SharedForm form={form} setForm={setForm} />

        {role === "student" && (
          <select
            className="w-full mb-4 border rounded p-2"
            value={form.teacherId}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            required
          >
            <option value="">Select Your Teacher</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.department})
              </option>
            ))}
          </select>
        )}

        {errorMsg && <p className="text-red-500 mb-2 text-sm">{errorMsg}</p>}
        {message && <p className="text-green-600 mb-2 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
