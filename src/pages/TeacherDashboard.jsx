import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function TeacherDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [currentTeacherId, setCurrentTeacherId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentTeacherId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentTeacherId) {
      fetchAppointments();
      fetchPendingStudents();
      fetchMessages();
    }
  }, [currentTeacherId]);


  // fetch appointment data and messages from students
  const fetchAppointments = async () => {
    const apptQuery = query(
      collection(db, "appointments"),
      where("teacherId", "==", currentTeacherId)
    );
    const snapshot = await getDocs(apptQuery);
    const appts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const userIds = appts.map((appt) => appt.studentId);
    const userQuery = query(collection(db, "users"), where("__name__", "in", userIds));
    const userSnap = await getDocs(userQuery);
    const userMap = {};
    userSnap.forEach((doc) => {
      userMap[doc.id] = doc.data();
    });

    // Filter for upcoming appointments only
    const now = new Date();
    const enrichedAppts = appts
      .map((appt) => {
        const apptTime = new Date(appt.time);
        return {
          ...appt,
          studentName: userMap[appt.studentId]?.fullName || "Unknown",
          studentEmail: userMap[appt.studentId]?.email || "Unknown",
          isUpcoming: apptTime > now,
        };
      })
      .filter((appt) => appt.isUpcoming); // Only show future appointments

    setAppointments(enrichedAppts);
  };


  // Fetch pending students for approval
  const fetchPendingStudents = async () => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "student"),
      where("approved", "==", false),
      where("teacherId", "==", currentTeacherId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPendingStudents(data);
  };

  // Fetch messages from students
    const fetchMessages = async () => {
  const q = query(
    collection(db, "messages"),
    where("teacherId", "==", currentTeacherId)
  );
  const snapshot = await getDocs(q);
  const rawMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Extract unique studentIds
  const studentIds = [...new Set(rawMessages.map(msg => msg.studentId))];

  // Fetch student info
  const studentQuery = query(collection(db, "users"), where("__name__", "in", studentIds));
  const studentSnap = await getDocs(studentQuery);
  const studentMap = {};
  studentSnap.forEach(doc => {
    studentMap[doc.id] = doc.data();
  });

  // Enrich messages
  const enrichedMessages = rawMessages.map(msg => ({
    ...msg,
    studentName: studentMap[msg.studentId]?.fullName || "Unknown Student",
  }));

  setMessages(enrichedMessages);
};


  // Approve or reject student
  const approveStudent = async (id) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    fetchPendingStudents();
  };

  const rejectStudent = async (id) => {
    await updateDoc(doc(db, "users", id), { rejected: true });
    fetchPendingStudents();
  };

  // Delete appointment
  const handleDeleteAppointment = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    // Update UI without re-fetching
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-10 p-4 bg-slate-900 text-white rounded-xl">
        Teacher Dashboard
      </h2>

      {/* Pending Students */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 bg-slate-300 rounded-xl p-2">
          Pending Student Approvals
        </h3>
        {pendingStudents.length === 0 ? (
          <p className="text-gray-600">No students pending approval.</p>
        ) : (
          <ul className="space-y-4">
            {pendingStudents.map((student) => (
              <li
                key={student.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {student.fullName} ({student.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Department: {student.department}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => approveStudent(student.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectStudent(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-xl font-bold mb-6 p-2 bg-slate-900 text-white rounded-xl">
          Upcoming Appointments
        </h3>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No upcoming appointments.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-slate-300 text-center text-md font-semibold">
                <th className="p-3">Sr. No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, i) => (
                <tr key={appt.id} className="border-t text-sm text-center">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{appt.studentName}</td>
                  <td className="p-3">{appt.studentEmail}</td>
                  <td className="p-3">{appt.time}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Student Messages */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4 p-2 bg-slate-300 rounded-xl">Student Messages</h3>
        {messages.length === 0 ? (
          <p className="text-gray-600">No messages from students.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li key={msg.id} className="bg-white p-4 rounded shadow">
                <p className="text-md mt-1">{msg.studentName} : {msg.message} </p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
