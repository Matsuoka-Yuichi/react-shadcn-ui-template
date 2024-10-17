import Layout from "./Layout";
import HomePage from "@/components/HomePage";
import AiTest from "@/components/AiTest";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai_test" element={<AiTest />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
