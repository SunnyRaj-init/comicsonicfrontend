"use client";
import React, { useState, useRef } from "react";
export default function Home() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const [submit, setsubmit] = useState(false);
  const click = useRef(false);
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type == "application/pdf") {
        if (file.size > MAX_FILE_SIZE) {
          event.target.value = ""; // Clear the selected file
          setsubmit(false);
          alert("file size exceeds 5MB");
        } else {
          setsubmit(true);
          alert("yohoh");
        }
      } else {
        event.target.value = ""; // Clear the selected file
        setsubmit(false);
        alert("please choose a pdf file only");
      }
    }
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center text-3xl">
      Listen to your comics Now!
      <input
        className="block mt-4 w-sm text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept=".pdf, application/pdf"
        onChange={handleFileChange}
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        PDF (MAX. 5MB).
      </p>
      {submit && (
        <button
          type="submit"
          disabled={click.current}
          className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={async () => {
            click.current = true;
            const formdata = new FormData();
            const fileinput = document.getElementById(
              "file_input"
            ) as HTMLInputElement;
            if (fileinput && fileinput.files) {
              const file = fileinput.files[0];
              formdata.append("file", file);
              try {
                const response = await fetch(
                  "http://localhost:5000/api/upload",
                  {
                    method: "POST",
                    body: formdata,
                  }
                );
                if (response.ok) {
                  console.log("File uploaded successfully", response);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  // Create a temporary link to trigger the download
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "file.mp3"; // Name the file to save
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  alert("audio file downloaded!");
                  click.current = false;
                } else {
                  console.log(response, "SEEETHIS");
                }
              } catch (err) {
                console.error("Error uploading file:", err);
              }
            }
            // formdata.append("file",selectedFile.current)
          }}
        >
          Upload
        </button>
      )}
    </div>
  );
}
