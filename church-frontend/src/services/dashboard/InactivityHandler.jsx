import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const InactivityHandler = () => {
    const { logout, setLoading } = useAuth();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    const myLogout = async () => {
        setLoading(true);
        const loggedOut = await logout();
        if (loggedOut) {
            localStorage.clear();
            setLoading(false);
            setIsAuthenticated(false);
            navigate("/login");
        } else {
            setLoading(false);
        }
    }

    const resetTimer = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(myLogout, 30 * 60 * 1000); // 30 mins
      };
    
      useEffect(() => {
        resetTimer();
    
        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach((event) => window.addEventListener(event, resetTimer));
    
        return () => {
          events.forEach((event) => window.removeEventListener(event, resetTimer));
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);
    
      return null;
}
export default InactivityHandler;