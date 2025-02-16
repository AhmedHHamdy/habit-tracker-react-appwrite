import React, { useState } from 'react';
import { account, ID } from './config/appwriteConfig';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from './context/AuthProvider';
import { FaGithub } from "react-icons/fa";


export default function Home()  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      setUser(await account.get());
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  }

  if (user) {
    return <Navigate to={"/dashboard"} />
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow flex flex-col items-center justify-center'>
        {error && <div className="toast toast-top">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>}

        <h1 className='mb-6 font-[Sigmar]'>Habit Hustle</h1>
        <form className='flex flex-col space-y-4 w-full max-w-xs'>
          <input className="input w-full" required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input w-full" required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {/* <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /> */}

          <button className='button' type="button" onClick={() => login(email, password)}>
            Login
          </button>

          <Link
            className='button text-white'
            to={"/register"}
          >
            Register
          </Link>

          {/* {loggedInUser && <button
            type="button"
            onClick={async () => {
              await account.deleteSession('current');
              setLoggedInUser(null);
            }}
          >
            Logout
          </button>} */}
        </form>
      </div>
      
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 self-end">
        <aside>
          <p><Link target='_blank' to={"https://github.com/AhmedHHamdy/habit-tracker-react-appwrite"} className='flex items-center hover:text-purple-300'><FaGithub className='w-16 h-6' /> Ahmed Hamdy</Link></p>
        </aside>
      </footer>
    </div>
  );
};

