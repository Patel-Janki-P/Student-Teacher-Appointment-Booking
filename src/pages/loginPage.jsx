// src/pages/LoginPage.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import SharedForm from "../components/sharedForm";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const role = new URLSearchParams(useLocation().search).get("role") || "student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setErrorMsg("User not found in database.");
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== role) {
        setErrorMsg(`You are trying to log in as a ${role}, but your role is ${userData.role}.`);
        return;
      }

      if (!userData.approved) {
        setErrorMsg("Your account is pending approval.");
        return;
      }

      // Navigate based on role
      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student");
      else setErrorMsg("Unknown user role.");

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4"> 
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 capitalize bg-slate-900 text-white p-2 rounded-xl text-center">
        Login as {role}
      </h2>
        <SharedForm form={form} setForm={setForm} isLogin={true} />

        {errorMsg && <p className="text-red-500 mb-2 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
