// src/components/SharedForm.jsx
export default function SharedForm({ form, setForm, isLogin = false }) {
  return (
    <>
      {/* Full Name and Department only for Register (not login) */}
      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
        </>
      )}

      {/* Common Email Field */}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />

      {/* Common Password Field */}
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
    </>
  );
}
