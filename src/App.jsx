import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Genres from "./pages/Genres";
import Upcoming from "./pages/Upcoming";
import MyList from "./pages/MyList";
import AnimeDetail from "./pages/AnimeDetail";
import SeasonalPage from "./pages/Seasonal";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/seasonal" element={<SeasonalPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
