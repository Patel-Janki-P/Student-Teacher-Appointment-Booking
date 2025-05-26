// src/components/RoleCard.jsx
import { Link } from "react-router-dom";

export default function RoleCard({ title, image, loginPath, registerPath }) {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg w-72 h-80 flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-200">
      {image && (
        <img
          src={image}
          alt={`${title} illustration`}
          className="h-28 w-28 object-contain mb-4"
        />
      )}
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <Link to={loginPath}>
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-lg">
          Login
        </button>
      </Link>
      <Link
        to={registerPath}
        className="mt-3 text-blue-500 text-sm hover:underline"
      >
        Sign Up
      </Link>
    </div>
  );
}
