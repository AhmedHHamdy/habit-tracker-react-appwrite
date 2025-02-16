import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { account } from '../config/appwriteConfig';

const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await account.get()
        // console.log(response)
        setUser(response)
      } catch (error) {
        console.error(error)
        setUser(null)
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  
  }, [])

  async function logout() {
    await account.deleteSession("current")
    setUser(null)
    navigate("/")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context == undefined) {
    throw new Error("useAuth must be used within an authProvider")
  }
  return context
}