import React, { useState } from "react";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [teamData, setTeamData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const results = parseCSV(text);

      // Filter out rows where 'Select team / mentor ' is empty or equals 'I am a mentor'
      const filteredTeamData = results.data.filter(
        (d) =>
          d['Select team / mentor '] &&
          d['Select team / mentor '] !== 'I am a mentor'
      );

      setTeamData(filteredTeamData);
    };
    reader.readAsText(file);
  };

  // Simple CSV parser helper
  const parseCSV = (text) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",");
    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index] ? values[index].trim() : "";
      });
      return entry;
    });
    return { headers, data };
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload CSV file</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleSubmit}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Process
      </button>

      {teamData.length > 0 && (
        <table className="mt-6 w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {Object.keys(teamData[0]).map((key) => (
                <th
                  key={key}
                  className="border border-gray-300 px-4 py-2 bg-gray-100"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamData.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

