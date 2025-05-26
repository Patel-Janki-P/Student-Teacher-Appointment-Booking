import RoleCard from "../components/RoleCard";
import studentImg from "../assets/student.png";
import teacherImg from "../assets/teacher.png";
import adminImg from "../assets/admin.png";



const roles = [
  {
    title: "Student",
    image: studentImg,
    loginPath: "/login?role=student",
    registerPath: "/register?role=student",
  },
  {
    title: "Teacher",
    image: teacherImg,
    loginPath: "/login?role=teacher",
    registerPath: "/register?role=teacher",
  },
  {
    title: "Admin",
    image: adminImg,
    loginPath: "/login?role=admin",
    registerPath: "/register?role=admin",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4">
      <h1 className="text-5xl font-bold mt-16 mb-4 text-center">Tutor-Time</h1>
      <h2 className="text-2xl font-semibold mb-12 text-center">Choose Your Role</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {roles.map((role) => (
          <RoleCard key={role.title} {...role} />
        ))}
      </div>
    </div>
  );
}
