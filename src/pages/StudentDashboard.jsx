import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [messageText, setMessageText] = useState("");
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const q = query(
        collection(db, "users"),
        where("role", "==", "teacher"),
        where("approved", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const teacherList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
    };

    fetchTeachers();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!selectedTeacher || !appointmentTime) {
      setFeedback("Please fill in all appointment fields.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        studentId: auth.currentUser.uid,
        teacherId: selectedTeacher,
        time: appointmentTime,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setFeedback("Appointment booked successfully!");
      setSelectedTeacher("");
      setAppointmentTime("");
    } catch (err) {
      setFeedback("Error booking appointment.");
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!selectedTeacher || !messageText) {
      setFeedback("Please select a teacher and enter a message.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        studentId: auth.currentUser.uid,
        teacherId: selectedTeacher,
        message: messageText,
        createdAt: serverTimestamp(),
      });

      setFeedback("Message sent!");
      setMessageText("");
    } catch (err) {
      setFeedback("Error sending message.");
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 bg-slate-900 text-white rounded-xl p-4">Student Dashboard</h2>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {feedback && (
        <p className="mb-4 text-sm font-medium text-center text-blue-600">
          {feedback}
        </p>
      )}

      {/* Book Appointment */}
      <div className="bg-white p-6 rounded shadow-xl mb-10">
        <h3 className="text-lg font-semibold mb-4 bg-slate-800 text-white rounded-xl p-1">Book an Appointment</h3>
        <form onSubmit={handleAppointment} className="space-y-4">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName} - {teacher.department}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      </div>

      {/* Send Message */}
      <div className="bg-white p-6 rounded shadow-xl">
        <h3 className="text-lg font-semibold mb-5 bg-slate-800 text-white rounded-xl p-1">Send a Message</h3>
        <form onSubmit={handleMessage} className="space-y-4">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName} - {teacher.department}
              </option>
            ))}
          </select>

          <textarea
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
