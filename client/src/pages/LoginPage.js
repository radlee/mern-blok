import { useContext, useState } from "react"
import { Navigate } from 'react-router-dom';
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('https://radblok-back-end.onrender.com/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'},
            credentials: 'include',
        });

        if(response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('Wrong credentials Entered');
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <>
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input  type="text" 
                    placeholder="Enter Usersane"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
            />
            <input  type="password" 
                    placeholder="Enter password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
        </>
    )
}