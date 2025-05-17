import { Link, Outlet } from "react-router-dom";

const NavbarLayout = () => {
  return (
    <div>
      <nav>
        <h1>
          AutoPitch
        </h1>
        <div>
          <Link to="/main">Idea Input</Link>
          <Link to="/decks">Results</Link>
        </div>
      </nav>

      {/* Page content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default NavbarLayout;
