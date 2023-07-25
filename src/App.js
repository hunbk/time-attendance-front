import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Holiday from "./scenes/holiday";
import SignIn from "./scenes/signIn";
import WorkGroup from "./scenes/workGroup";
import NewGroup from "./scenes/workGroup/newGroup";
import Schedule from "./scenes/schedule";
import Authorization from "./scenes/authorization";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* 김홍주 시작 */}
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/workGroup" element={<WorkGroup />} />
              <Route path="/workGroup/newGroup" element={<NewGroup />} />
              {/* 김홍주 끝 */}

              {/* 김병훈 시작 */}
              <Route path="/holyday" element={<Holiday />} />
              {/* 김병훈 끝 */}

              {/* 이승윤 시작 */}
              <Route path="/" element={<Dashboard />} />
              {/* 이승윤 끝 */}

              {/* 박지호 시작 */}
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/authorization" element={<Authorization />} />
              {/* 박지호 끝 */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
