import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PitchDeckList = () => {
  const [pitchDecks, setPitchDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setPitchDecks([]);
      return;
    }
    axios.get('http://127.0.0.1:3000/api/pitch-decks', {
      params: { username }
    })
      .then(res => setPitchDecks(res.data.pitchDecks))
      .catch(() => setPitchDecks([]));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Saved Pitch Decks</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {pitchDecks.map((pitch) => (
          <div
            key={pitch.id}
            onClick={() => navigate(`/pitch-decks/${pitch.id}`)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
              width: "200px",
            }}
          >
            {/* <h3>{pitch.id || "NO ID"}</h3> */}
            <h3>{pitch.pitchTitle || "Untitled Pitch"}</h3>
            <p>{pitch.refinedProblem?.slice(0, 50)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitchDeckList;
