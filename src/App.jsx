import { useState, lazy, Suspense } from "react";

//
import Navbar from "./components/navbar/Navbar";

// Pages
const PostPage = lazy(() => import("./pages/postPage/PostPage"));
const PhotoPage = lazy(() => import("./pages/photoPage/PhotoPage"));
const TaskPage = lazy(() => import("./pages/taskPage/TaskPage"));

// Miscellaneous
import { RingLoader } from "react-spinners";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Suspense
          fallback={
            <section className="flex flex-col items-center justify-center min-h-screen">
              <RingLoader color="#3a6afd" />
            </section>
          }
        >
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<PostPage />} />
            <Route path="/photo" element={<PhotoPage />} />
            <Route path="/task" element={<TaskPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
