import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import IPOListPage from "./pages/IPOLIstPage";
import IPOFormPage from "./pages/IPOFormPage";
import IPODetailPage from "./pages/IPODetailPage";
import IPOEditPage from "./pages/IPOEditPage";

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/ipos">IPO List</Link> <Link to="/ipos/new">Add IPO</Link>{" "}
          <Link to="/ipos/:id/edit">IPO EDIT</Link>
        </nav>
      
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ipos" replace />} />
          <Route path="/ipos" element={<IPOListPage />} />
          <Route path="/ipos/new" element={<IPOFormPage />} />
          <Route path="/ipos/:id" element={<IPODetailPage />} />
          <Route path="/ipos/:id/edit" element={<IPOEditPage />} />
          <Route path="*" element={<Navigate to="/ipos" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
