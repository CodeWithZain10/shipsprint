import {createContext, useContext, useState} from 'react'
import api from "../services/api"


const AuthContext = createContext()
 
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const login = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post("/auth/login", {email, password})
            localStorage.setItem("token", response.data.token)
            setUser(response.data.user)
            return true
        } catch (error) {
            setError(error?.response?.data?.message || "Login failed")
            return false
        }
        finally{
            setLoading(false)
        }
    }
    const register = async (username, email, password) => {
       setLoading(true)
       setError(null)

       try {
        const response = await api.post("/auth/register", {username, email, password})
        console.log(response)
        localStorage.setItem("token", response.data.token)
        setUser(response.data.user)
        return true

       } catch (error) {
        setError(error?.response?.data?.message || "Registration failed")
            return false
       }
       finally{
        setLoading(false)
       }
    }
    const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

    return(
        <AuthContext.Provider value={{login, register, logout, user, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}

