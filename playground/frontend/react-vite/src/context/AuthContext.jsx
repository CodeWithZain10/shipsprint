import {createContext, useContext, useState} from 'react'
import api from "../services/api"
import { toast} from "react-hot-toast"


const AuthContext = createContext()
 
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const signin = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const response = await api.post("/auth/signin", {email, password})
            localStorage.setItem("token", response.data.token)
            setUser(response.data.user)
            toast.success("Signin Successfully!")
            return true
        } catch (error) {
            const message = error?.response?.data?.message || "Signin failed"
            setError(message)
            toast.error(message)
            return false
        }
        finally{
            setLoading(false)
        }
    }
    const signup = async (username, email, password) => {
       setLoading(true)
       setError(null)

       try {
        const response = await api.post("/auth/signup", {username, email, password})
        console.log(response)
        localStorage.setItem("token", response.data.token)
        setUser(response.data.user)
        toast.success("Signup Successfully!")
        return true

       } catch (error) {
        const message = error?.response?.data?.message || "Signup failed"
        toast.error(message)
        setError(message)
            return false
       }
       finally{
        setLoading(false)
       }
    }
    const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success("Signout Successfully!")
  };

    return(
        <AuthContext.Provider value={{signin, signup, signout, user, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}

