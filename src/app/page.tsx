"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const ComicSonic: React.FC = () => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showEffect, setShowEffect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    processFile(uploadedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const processFile = (uploadedFile: File) => {
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        triggerEffect();
        alert("File size exceeds 5MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFile(null);
      } else {
        setFile(uploadedFile);
        triggerEffect();
      }
    } else {
      triggerEffect();
      alert("Please upload a PDF comic file!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
    }
  };

  const triggerEffect = () => {
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 800);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://comicsonicbackend.online/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "comic-audio.mp3"; // Name the file to save
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        triggerEffect();
        alert("Audio file downloaded successfully!");
      } else {
        console.error("Upload failed:", response);
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("An error occurteal. Please try again.");
    } finally {
      setIsUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-screen bg-[url('/gtm.jpg')] bg-cover bg-center bg-no-repeat min-h-screen text-white flex flex-col items-center relative overflow-hidden">
      {/* Comic dots background */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>

      {/* Comic effect */}
      {showEffect && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-9xl font-extrabold text-teal-400 stroke-black stroke-2">
            POW!
          </span>
        </motion.div>
      )}

      <nav className="flex justify-between items-center p-6 px-12 w-full z-10">
        <motion.div
          className="text-4xl font-extrabold font-comic tracking-wide"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-teal-400">COMIC</span>
          <span className="text-white">SONIC</span>
        </motion.div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow w-full px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-comic font-bold mb-4 text-teal-400">
            COMIC-TO-AUDIO PROTOTYPE
          </h1>
          <p className="text-xl max-w-2xl">
            Experience comics like never before - with immersive soundscapes!
          </p>
        </motion.div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
          id="fileInput"
        />

        <motion.div
          className="p-12 rounded-3xl shadow-comic-xl w-full max-w-2xl text-center cursor-pointer relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          transition={{ duration: 0.3 }}
        >
          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-3xl font-comic font-bold text-teal-400 mb-2">
                {file.name}
              </h3>
              <p className="text-lg">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-sm mt-4 text-gray-300">
                Click to select a different comic
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl font-comic font-bold text-blue-100 mb-6">
                DROP YOUR COMIC HERE
              </h3>
              <p className="text-xl mb-2">or click to browse files</p>
              <p className="text-sm text-gray-500">
                Supports PDF comics only (MAX. 5MB)
              </p>
            </motion.div>
          )}
        </motion.div>

        {file && (
          <motion.button
            onClick={handleUpload}
            className="mt-12 px-12 py-4 bg-teal-500 text-black rounded-full shadow-comic-xl hover:bg-teal-400 text-2xl font-comic font-bold relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={isUploading}
          >
            {isUploading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <motion.svg
                  className="animate-spin -ml-1 mr-3 h-6 w-6 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </motion.svg>
                CONVERTING...
              </motion.span>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                CREATE AUDIO EXPERIENCE! 🚀
              </motion.span>
            )}
          </motion.button>
        )}

        {isUploading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 0.8],
              y: 0,
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <div className="text-4xl mb-4">✨</div>
            <div className="text-2xl font-comic text-teal-300">
              Crafting your sonic comic experience!
            </div>
          </motion.div>
        )}
      </main>

      <footer className="w-full bg-black bg-opacity-80 py-6 text-center text-teal-400 font-comic text-lg mt-12">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-teal-400">COMICSONIC</span> - Where ink meets
          audio
        </p>
        <p className="text-sm mt-2 font-sans">
          Experience comics like never before!
        </p>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap");

        .font-comic {
          font-family: "Bangers", cursive;
          letter-spacing: 1px;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
        }

        .shadow-comic-xl {
          box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.3);
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default ComicSonic;
