import React, { useState, useEffect } from 'react';
import { TrendingUp, Building, User, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import './App.css';

export default function AIBioHubDashboard() {
  const [csvData, setCsvData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('./ai-biohub-survey-data.csv');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileContent = await response.text();
      
      console.log('CSV loaded, length:', fileContent.length);
      
      const result = Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      console.log('Parsed data:', result.data.length, 'rows');
      
      if (result.errors.length > 0) {
        console.warn('CSV parsing warnings:', result.errors);
      }
      
      setCsvData(result.data);
      setDataLoaded(true);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError(`Error loading data: ${error.message}`);
      setDataLoaded(true);
    }
  };

  const teamData = csvData.filter(d => d['Select team / mentor '] && d['Select team / 
mentor '] !== 'I am a mentor');
  const mentorData = csvData.filter(d => d['Select team / mentor '] === 'I am a 
mentor');
  const teams = [...new Set(teamData.map(d => d['Select team / mentor ']))].sort();
  const mentors = [...new Set(mentorData.map(d => d.Name))].sort();

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 
border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading AI BioHub dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading 
Data</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Make sure your CSV file is 
uploaded to the public folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI BioHub 
Dashboard</h1>
              <p className="text-gray-600">{csvData.length} responses • {teams.length} 
teams • {mentors.length} mentors</p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setActiveView('overview')} className={`px-4 py-2 
rounded-lg flex items-center transition-colors ${activeView === 'overview' ? 
'bg-red-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button onClick={() => setActiveView('teams')} className={`px-4 py-2 
rounded-lg flex items-center transition-colors ${activeView === 'teams' ? 'bg-red-800 
text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <Building className="h-4 w-4 mr-2" />
                Teams
              </button>
              <button onClick={() => setActiveView('mentors')} className={`px-4 py-2 
rounded-lg flex items-center transition-colors ${activeView === 'mentors' ? 
'bg-red-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                <User className="h-4 w-4 mr-2" />
                Mentors
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program 
Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Total Responses</h3>
                  <p className="text-2xl font-bold text-red-600">{csvData.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Active Teams</h3>
                  <p className="text-2xl font-bold text-red-600">{teams.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Team Responses</h3>
                  <p className="text-2xl font-bold text-red-600">{teamData.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Mentor Responses</h3>
                  <p className="text-2xl font-bold 
text-red-600">{mentorData.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Teams 
Overview</h3>
                <div className="space-y-3">
                  {teams.map(team => {
                    const teamResponses = teamData.filter(d => d['Select team / mentor 
'] === team);
                    return (
                      <div key={team} className="flex justify-between items-center p-3 
bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">{team}</span>
                        <div className="text-sm text-gray-600">{teamResponses.length} 
responses</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mentors 
Overview</h3>
                <div className="space-y-3">
                  {mentors.map(mentor => {
                    const mentorResponses = mentorData.filter(d => d.Name === mentor);
                    return (
                      <div key={mentor} className="flex justify-between items-center 
p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">{mentor}</span>
                        <div className="text-sm 
text-gray-600">{mentorResponses.length} responses</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'teams' && (
          <div className="space-y-6">
            {selectedTeam === 'all' ? (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
xl:grid-cols-4 gap-4">
                  {teams.map(team => (
                    <div 
                      key={team}
                      onClick={() => setSelectedTeam(team)}
                      className="border border-gray-200 rounded-lg p-4 
hover:border-red-300 hover:shadow-md transition-all cursor-pointer bg-gray-50 
hover:bg-white"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 
text-center">{team}</h3>
                      <div className="text-center">
                        <span className="text-sm text-gray-600">
                          {teamData.filter(d => d['Select team / mentor '] === 
team).length} responses
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6 border 
border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold 
text-gray-900">{selectedTeam}</h2>
                      <p className="text-gray-600 mt-1">
                        {teamData.filter(d => d['Select team / mentor '] === 
selectedTeam).length} total responses
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedTeam('all')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
hover:bg-gray-300"
                    >
                      ← Back to Team Selection
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border 
border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team 
Responses</h3>
                  <div className="space-y-4">
                    {teamData.filter(d => d['Select team / mentor '] === 
selectedTeam).map((response, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg 
p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold 
text-gray-900">{response.Name}</h4>
                          <span className="text-sm text-gray-600">{response['Week 
providing feedback for ']}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 
text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Learning 
Score: </span>
                            <span className="text-red-600">{response['To what extent 
did you gain new insights from this week\'s workshop(s)? '] || 'N/A'}/5</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Recommend 
Score: </span>
                            <span className="text-red-600">{response['Based on this 
week\'s workshop(s), how likely would you recommend the Cohort Program to other 
founders, entrepreneurs, and innovators.'] || 'N/A'}/5</span>
                          </div>
                        </div>
                        {response['What was the highlight of the week for you? (e.g., 
a specific session, new learning, networking event, a breakthrough moment)'] && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-700">Highlight: 
</span>
                            <span className="text-gray-600">{response['What was the 
highlight of the week for you? (e.g., a specific session, new learning, networking 
event, a breakthrough moment)']}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'mentors' && (
          <div className="space-y-6">
            {selectedMentor === 'all' ? (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select 
Mentor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
xl:grid-cols-4 gap-4">
                  {mentors.map(mentor => (
                    <div 
                      key={mentor}
                      onClick={() => setSelectedMentor(mentor)}
                      className="border border-gray-200 rounded-lg p-4 
hover:border-red-300 hover:shadow-md transition-all cursor-pointer bg-gray-50 
hover:bg-white"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 
text-center">{mentor}</h3>
                      <div className="text-center">
                        <span className="text-sm text-gray-600">
                          {mentorData.filter(d => d.Name === mentor).length} responses
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6 border 
border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold 
text-gray-900">{selectedMentor}</h2>
                      <p className="text-gray-600 mt-1">
                        {mentorData.filter(d => d.Name === selectedMentor).length} 
total responses
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedMentor('all')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
hover:bg-gray-300"
                    >
                      ← Back to Mentor Selection
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border 
border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor 
Responses</h3>
                  <div className="space-y-4">
                    {mentorData.filter(d => d.Name === selectedMentor).map((response, 
idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg 
p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold 
text-gray-900">{response.Name}</h4>
                          <span className="text-sm text-gray-600">{response['Week 
providing feedback for ']}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 
text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Learning 
Score: </span>
                            <span className="text-red-600">{response['To what extent 
did you gain new insights from this week\'s workshop(s)? '] || 'N/A'}/5</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Recommend 
Score: </span>
                            <span className="text-red-600">{response['Based on this 
week\'s workshop(s), how likely would you recommend the Cohort Program to other 
founders, entrepreneurs, and innovators.'] || 'N/A'}/5</span>
                          </div>
                        </div>
                        {response['What was the highlight of the week for you? (e.g., 
a specific session, new learning, networking event, a breakthrough moment)'] && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-700">Highlight: 
</span>
                            <span className="text-gray-600">{response['What was the 
highlight of the week for you? (e.g., a specific session, new learning, networking 
event, a breakthrough moment)']}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
