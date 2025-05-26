// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

export default function AdminDashboard() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchPendingTeachers();
    fetchAllTeachers();
    fetchAllAppointments();
  }, []);

  const fetchPendingTeachers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "teacher"), where("approved", "==", false));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPendingTeachers(data);
  };

  const fetchAllTeachers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAllTeachers(data);
  };

  const fetchAllAppointments = async () => {
    const snapshot = await getDocs(collection(db, "appointments"));
    const now = new Date();

    const appointmentData = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const apptDate = new Date(data.time);
        if (apptDate <= now) return null;

        let fullName = "N/A", email = "N/A", teacherName = "N/A";
        if (data.studentId) {
          const studentRef = doc(db, "users", data.studentId);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            const studentData = studentSnap.data();
            fullName = studentData.fullName || fullName;
            email = studentData.email || email;
          }
        }

        if (data.teacherId) {
          const teacherRef = doc(db, "users", data.teacherId);
          const teacherSnap = await getDoc(teacherRef);
          if (teacherSnap.exists()) {
            teacherName = teacherSnap.data().fullName || teacherName;
          }
        }

        return {
          id: docSnap.id,
          ...data,
          fullName,
          studentEmail: email,
          teacherName,
        };
      })
    );

    setAppointments(appointmentData.filter(Boolean));
  };


  const approveTeacher = async (id) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    fetchPendingTeachers();
    fetchAllTeachers();
  };

  const approveAllTeachers = async () => {
    for (const teacher of pendingTeachers) {
      await updateDoc(doc(db, "users", teacher.id), { approved: true });
    }
    fetchPendingTeachers();
    fetchAllTeachers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 bg-slate-900 text-white rounded-xl p-4">Admin Dashboard</h2>

      {/* Pending Teachers */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 bg-slate-900 text-white p-1 rounded-xl">
          Approve Pending Teachers
        </h3>

        {pendingTeachers.length === 0 ? (
          <p>No teachers pending approval.</p>
        ) : (
          <>
            <button
              onClick={approveAllTeachers}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Approve All
            </button>
            <ul className="space-y-4">
              {pendingTeachers.map((t) => (
                <li key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t.fullName} ({t.email})</p>
                    <p className="text-sm text-gray-600">Department: {t.department}</p>
                  </div>
                  <button
                    onClick={() => approveTeacher(t.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>


      {/* Appointments Table */}
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-6 bg-slate-900 text-white p-1 rounded-xl">All Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-slate-300 text-center">
                  <th className="px-4 py-2 border">Sr. No</th>
                  <th className="px-4 py-2 border">Student Name</th>
                  <th className="px-4 py-2 border">Student Email</th>
                  <th className="px-4 py-2 border">Teacher</th>
                  <th className="px-4 py-2 border">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, index) => (
                  <tr key={apt.id}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{apt.fullName}</td>
                    <td className="px-4 py-2 border">{apt.studentEmail}</td>
                    <td className="px-4 py-2 border">{apt.teacherName}</td>
                    <td className="px-4 py-2 border">{apt.time}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
