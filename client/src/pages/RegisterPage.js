import { useState } from "react";
import {BASE_URL} from '../helper';
export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if(response.status === 200) {
            alert('Registered Successfully!');
        } else {
            alert('Registration Failed, Please Try again.')
        }
    }
    return (
        <>
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input 
                type="text" 
                placeholder="Enter Usersane"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input 
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Register</button>
        </form>
        </>
    )
}