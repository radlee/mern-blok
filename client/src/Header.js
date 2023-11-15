import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header () {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('https://radblok-back-end.onrender.com/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('https://radblok-back-end.onrender.com/logout', {
      credentials: 'include',
      method: 'POST'
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
    return(
        <header>
        <Link to="/" className="logo">radBlok</Link>
          <nav>
            {username && (
              <>
               <Link to="/create">Add Post</Link>
               <button onClick={logout}>Logout</button>
              </>
            )}
            {!username && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
      </header>
    )
}