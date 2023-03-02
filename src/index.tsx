// External imports
import { Suspense } from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Box, Container, createTheme, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { BrowserTracing } from "@sentry/tracing";

// Local imports
import App from "./app";
import AuthProvider from "./context/AuthProvider";
import LoadingProvider from "./context/LoadingProvider";
import ErrorBoundary from "./error-boundary";
import { Navbar } from "./components/Navbar";
import LocaleProvider from "./context/LocaleProvider";
import LoadingModal from "./modals/Loading";

import reportWebVitals from "./util/web-vitals";

import "react-toastify/dist/ReactToastify.css";
import "./styles/main.scss";
import initI18n from "./routes/i18n";
import { PagesList } from "./components/PagesList";

// Global initialization
initI18n();
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  tunnel: "/unblocksentry",
});

const htmlRoot = document.getElementById("root") as HTMLElement;
const reactRoot = createRoot(htmlRoot);
const reportOn = false;

const theme = createTheme({
  typography: {
    fontFamily: "Fira Code",
  },
});

const containerSx = {
  border: "1px solid #dedede",
  borderRadius: "4px",
  padding: ["10px", "10px", "20px"],
  marginBottom: ["10px", "20px"],
};

const LocaleWrapper = ({ children }: { children: JSX.Element }) => {
  return <LocaleProvider>{children}</LocaleProvider>;
};

reactRoot.render(
  <ThemeProvider theme={theme}>
    <LocaleWrapper>
      <Suspense fallback={<LoadingModal isOpen />}>
        <Box
          sx={{
            backgroundColor: "#f8f8f9",
            minHeight: "100vh",
            padding: ["10px", "20px 10px"],
            boxSizing: "border-box",
          }}
        >
          <ToastContainer
            theme="colored"
            position="top-right"
            rtl={false}
            autoClose={5000}
            newestOnTop={false}
            hideProgressBar={false}
            draggable
            closeOnClick
            pauseOnHover
            pauseOnFocusLoss
          />

          <ErrorBoundary>
            <AuthProvider>
              <LoadingProvider>
                <Box>
                  <Router basename={process.env.PUBLIC_URL}>
                    <Navbar />
                    <Container maxWidth={false} sx={containerSx}>
                      <PagesList />
                    </Container>
                    <Container maxWidth={false} sx={containerSx}>
                      <App />
                    </Container>
                  </Router>
                </Box>
              </LoadingProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Box>
      </Suspense>
    </LocaleWrapper>
  </ThemeProvider>
);

if (process.env.REACT_APP_ENV !== "production" && reportOn) {
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
