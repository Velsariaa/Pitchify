import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://127.0.0.1:3000/api/register', { username, password })
      setMessage("Registration successful! You can now login.")
      setSuccess(true)
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.")
      setSuccess(false)
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" disabled={success} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" disabled={success} />
      <button type="submit" disabled={success}>Register</button>
      <button type="button" onClick={() => navigate("/")} disabled={success}>Back</button>
      <div>{message}</div>
      {success && (
        <button type="button" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      )}
    </form>
  )
}

export default Register