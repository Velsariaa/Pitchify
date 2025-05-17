import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/PitchResults.css";

const PitchDeckViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    console.log("Looking up ID:", id);
    axios.get(`http://127.0.0.1:3000/api/pitch-decks/${id}`)
      .then(res => setDeck(res.data))
      .catch(() => {
        alert("Pitch deck not found.");
        navigate("/decks");
      });
  }, [id, navigate]);

  if (!deck) return null;

  const { pitchTitle, refinedProblem, slides = [] } = deck;

  const allSlides = [
    { title: pitchTitle, content: "", presenterNotes: "", type: "title" },
    { title: "Refined Problem", content: refinedProblem, presenterNotes: "", type: "problem" },
    ...slides.map((s) => ({ ...s, type: "content" })),
  ];

  const slide = allSlides[currentSlide];
  const handlePrev = () => setCurrentSlide((p) => Math.max(p - 1, 0));
  const handleNext = () => setCurrentSlide((p) => Math.min(p + 1, allSlides.length - 1));

  return (
    <div className="results-container">
      <div className="slide-canvas">
        <h2 className="slide-title">{slide.title}</h2>
        {slide.content && (
          <p className="slide-content">
            {typeof slide.content === "string" ? slide.content.replace(/\*+/g, "").trim() : ""}
          </p>
        )}
        {slide.presenterNotes && (
          <p className="slide-notes">Notes: {slide.presenterNotes}</p>
        )}
      </div>

      <div className="navigation">
        <button onClick={handlePrev} disabled={currentSlide === 0}>Previous</button>
        <span>Slide {currentSlide + 1} of {allSlides.length}</span>
        <button onClick={handleNext} disabled={currentSlide === allSlides.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default PitchDeckViewer;
