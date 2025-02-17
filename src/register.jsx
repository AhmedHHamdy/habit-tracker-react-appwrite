import React, { useState } from "react";
import { account, ID } from "./config/appwriteConfig";
import { Link, Navigate } from "react-router";
import { useAuth } from "./context/AuthProvider";
import { FaGithub } from "react-icons/fa";
import Navbar from "./components/Navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const { user, setUser } = useAuth();

  async function register(email, password, name) {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      setUser(await account.get());
    } catch (error) {
      setError(error.message);
    }
  }

  if (user) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        {error && (
          <div className="toast toast-top">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div>
        )}

        <h1 className="mb-6 font-[Sigmar]">Habit Hustle</h1>
        <form className="flex flex-col space-y-4 w-full max-w-xs">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="input"
              required
              placeholder="Name"
              minlength="3"
              maxlength="30"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="mail@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Password"
              minlength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="button"
            type="button"
            onClick={async () => {
              await register(email, password, name);
            }}
          >
            Register
          </button>

          <Link className="button text-white" to={"/"}>
            Login
          </Link>
        </form>
      </div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 self-end">
        <aside>
          <p>
            <Link
              target="_blank"
              to={"https://github.com/AhmedHHamdy/habit-tracker-react-appwrite"}
              className="flex items-center hover:text-purple-300"
            >
              <FaGithub className="w-16 h-6" /> Ahmed Hamdy
            </Link>
          </p>
        </aside>
      </footer>
    </div>
  );
}
