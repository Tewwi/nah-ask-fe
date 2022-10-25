import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import React, { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "./router/route";
import { createTheme } from "@mui/material/styles";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./router/ProtectedRoute";
import Loading from "./components/common/Loading";

function App() {
  const theme = createTheme();
  const { pathname } = useLocation();

  return (
    <>
      <CssBaseline />
      <div
        style={
          !/login|register/.test(pathname)
            ? { backgroundColor: "#ecf1f1ab", minHeight: "100vh" }
            : {}
        }
      >
        <ThemeProvider theme={theme}>
          <Layout />
          <Suspense fallback={<Loading height={80} open={true} />}>
            <Routes>
              {routes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedRoute route={route} />}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
