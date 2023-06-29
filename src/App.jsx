import { useState, lazy, Suspense } from "react";

//
import Navbar from "./components/navbar/Navbar";

// Pages
const PostPage = lazy(() => import("./pages/postPage/PostPage"));
const AlbumPage = lazy(() => import("./pages/albumPage/AlbumPage"));
const TaskPage = lazy(() => import("./pages/taskPage/TaskPage"));
const PhotoPage = lazy(() => import("./pages/photoPage/PhotoPage"));

// Miscellaneous
import { RingLoader } from "react-spinners";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Toaster
          containerClassName="font-medium text-customText2"
          toastOptions={{
            duration: 2500,
          }}
        />
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
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/album/:id" element={<PhotoPage />} />
            <Route path="/task" element={<TaskPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
