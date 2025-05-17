import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (username) {
      navigate("/main");
    }
  }, [username, navigate]);

  return (
    <div>
      <h1>AutoPitch</h1>
      <p>
        Turn your raw idea into a full AI-generated pitch deck with editable slides, scripts, and themes.
      </p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/login")} style={{ marginRight: "0.5rem" }}>
          Login
        </button>
        <button onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
