import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      {/* You can add a global navbar or footer here later */}
      <Outlet />
    </div>
  );
}
