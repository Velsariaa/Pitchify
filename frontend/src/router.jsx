import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainPage from "./pages/MainPage";
import NavbarLayout from "./components/NavbarLayout";
import PitchDeckList from "./pages/PitchDeckList";
import PitchDeckViewer from "./pages/PitchDeckViewer";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/", element: <NavbarLayout />, children: [
      { path: "/main", element: <MainPage />},
      { path: "/decks", element: <PitchDeckList />},
      { path: "/pitch-decks/:id", element: <PitchDeckViewer />},
    ]

  },
]);

export default router;
