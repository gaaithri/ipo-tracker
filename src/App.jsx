import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IPOListPage from "./pages/IPOLIstPage";
import IPOFormPage from "./pages/IPOFormPage";
import IPODetailPage from "./pages/IPODetailPage";
import IPOEditPage from "./pages/IPOEditPage";

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/ipos">IPO List</Link> <Link to="/ipos/new">Add IPO</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/ipos" element={<IPOListPage />} />
          <Route path="/ipos/new" element={<IPOFormPage />} />
          <Route path="/ipos/:id" element={<IPODetailPage />} />
          <Route path="/ipos/:id/edit" element={<IPOEditPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
