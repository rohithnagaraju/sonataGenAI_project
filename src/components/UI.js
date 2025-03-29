import React, { useState } from "react";
import axios from "axios";

const DocumentSearchBot = () => {
  const [userType, setUserType] = useState("normal"); // 'admin' or 'normal'
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://127.0.0.1:8000/upload/", formData);
    setUploadedFiles([...uploadedFiles, file.name]);
  };

  const handleDelete = async (filename) => {
    await axios.delete(`http://127.0.0.1:8000/delete/?filename=${filename}`);
    setUploadedFiles(uploadedFiles.filter((f) => f !== filename));
  };

  const handleQuery = async () => {
    const res = await axios.get("http://127.0.0.1:8000/query/", {
      params: { question },
    });
    setResponse(res.data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Document Search Bot</h1>
      <select onChange={(e) => setUserType(e.target.value)}>
        <option value="normal">Normal User</option>
        <option value="admin">Admin</option>
      </select>
      {userType === "admin" && (
        <div className="mt-4">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="ml-2 px-4 py-2 bg-blue-500 text-white">
            Upload
          </button>
        </div>
      )}
      {userType === "admin" && uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h2>Uploaded Files</h2>
          <ul>
            {uploadedFiles.map((filename, index) => (
              <li key={index} className="flex justify-between">
                {filename}
                <button
                  onClick={() => handleDelete(filename)}
                  className="px-2 py-1 bg-red-500 text-white"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleQuery} className="ml-2 px-4 py-2 bg-green-500 text-white">
          Search
        </button>
      </div>
      {response && (
        <div className="mt-4 p-2 border">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentSearchBot;
