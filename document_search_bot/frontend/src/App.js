import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const DocumentSearchBot = () => {
  const [userType, setUserType] = useState("normal"); // 'admin' or 'normal'
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/files/`);
      setUploadedFiles(res.data.files);
    } catch (err) {
      console.error("Failed to fetch file list:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_URL}/upload/`, formData);
      setUploadedFiles([...uploadedFiles, file.name]);
      setFile(null);
    } catch (err) {
      setError("File upload failed.");
    }
    setLoading(false);
  };

  const handleDelete = async (filename) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/delete/?filename=${filename}`);
      setUploadedFiles(uploadedFiles.filter((f) => f !== filename));
    } catch (err) {
      setError("Failed to delete file.");
    }
    setLoading(false);
  };

  const handleQuery = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/query/`, {
        params: { question },
      });
      setResponse(res.data.response);
    } catch (err) {
      setError("Query failed.");
    }
    setLoading(false);
  };

  return (
    <div className="container colorful">
      <h1>Document Search Bot</h1>

      <select onChange={(e) => setUserType(e.target.value)} value={userType}>
        <option value="normal">Normal User</option>
        <option value="admin">Admin</option>
      </select>

      {userType === "admin" && (
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {userType === "admin" && uploadedFiles.length > 0 && (
        <div>
          <h2>Uploaded Files</h2>
          <ul>
            {uploadedFiles.map((filename, index) => (
              <li key={index}>
                {filename}
                <button onClick={() => handleDelete(filename)} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleQuery} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {response && (
        <div className="response-box">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
      
      <footer className="footer">
        App is developed by Rohith A N
      </footer>
    </div>
  );
};

export default DocumentSearchBot;
