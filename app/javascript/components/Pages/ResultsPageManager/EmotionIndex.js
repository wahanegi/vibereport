import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ComposedChart, Line, ReferenceLine } from 'recharts';

const PreviewEmotionIndex = () =>
  <div className='results col'>
    <div className='row calculate preview mb-3' />
  </div>

const EmotionIndex = ({ data, setData, teams, nextTimePeriod, isMinUsersResponses }) => {

  function getDataForTeam(team) {
    const emotionData = {
      name: team.name,
      Current: team.emotion_index_current_period || 0,
      Previous: team.previous_emotion_index || 0,
      Average: team.emotion_index_all || 0
    };
  
    const productivityData = {
      name: team.name,
      Current: Math.round(((team.productivity_average_current_period || 0) / 9) * 100),
      Previous: Math.round(((team.previous_productivity_average || 0) / 9) * 100),
      Average: Math.round(((team.productivity_average_all || 0) / 9) * 100)
    };
  
    return { emotionData, productivityData };
  }

  function comparisonDescription(current, previous, positiveWord, negativeWord) {
    if (current > previous) return positiveWord;
    if (current < previous) return negativeWord;
    
    return "about the same";
  }
  
  function happinessDescription(emotionIndex, currentEmotionIndex) {
    return comparisonDescription(currentEmotionIndex, emotionIndex, "happier", " less happy");
  }
  
  function productivityDescription(productivity, currentProductivity) {
    return comparisonDescription(currentProductivity, productivity, "more", "less");
  }
  
  function happinessChangeDescription(currentEmotionIndex, previousEmotionIndex) {
    return comparisonDescription(currentEmotionIndex, previousEmotionIndex, "happier", "less happy");
  }
  
  function productivityChangeDescription(currentProductivity, previousProductivity) {
    return comparisonDescription(currentProductivity, previousProductivity, "more", "less");
  }

if(!nextTimePeriod && isMinUsersResponses) return <PreviewEmotionIndex />

if (isMinUsersResponses) {
  return (
    <div className='results col'>
      <div className='row calculate mb-3 no-responses'>
        <p>No responses this time...</p>
      </div>
    </div>
  );
}

return (
  <div>
    {teams.map(team => {
      const { emotionData, productivityData } = getDataForTeam(team);
      return (
        <div key={team.id}>
            {Number(team.previous_emotion_index) >= 0 && (
                <>
                  <div className='h5 w-auto text-start truncated fw-semibold calculate'>
                      <p className='grey'>The <span className="team-name">{team.name}</span> is feeling <span className="team-name">{happinessChangeDescription(team.emotion_index_current_period || 0, team.previous_emotion_index || 0)}</span> than last week and <span className="team-name">{happinessDescription(team.emotion_index_all || 0, team.emotion_index_current_period || 0)}</span> than its average.</p>
                  </div>
                  <div className='h5 w-auto text-start truncated fw-semibold calculate'>
                      <p className='grey'> The <span className="team-name">{team.name}</span> is feeling <span className="team-name">{productivityChangeDescription(team.productivity_average_current_period || 0, team.previous_productivity_average || 0)} </span> productive than last week and significantly <span className="team-name">{productivityDescription(team.productivity_average_all || 0, team.productivity_average_current_period || 0)}</span> than its average.</p>
                  </div>
                </>
            )}
          <div className="charts-wrapper">
            <ResponsiveContainer width={400} height={300}>
              <ComposedChart data={[emotionData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#6593EB" />
                <XAxis dataKey="name" tick={false} stroke="#6593EB" />
                <YAxis stroke="#6593EB" domain={[0, 8]}/>
                <Tooltip />                
                <Bar dataKey="Previous" fill="#82ca9d" />
                <Bar dataKey="Current" fill="#8884d8" />
                <Line type="monotone" dataKey="Average" stroke="#ffc658" dot={false} isAnimationActive={false} />
                <ReferenceLine y={emotionData.Average} stroke="#ffc658" ifOverflow="extendDomain" strokeWidth={5}/>
                <text x={230} y={25} textAnchor="middle" fill="#000" stroke="#6593EB" fontSize="16">{team.name} Happiness</text>
              </ComposedChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={400} height={300}>
              <ComposedChart width={400} height={300} data={[productivityData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#6593EB" />
                <XAxis dataKey="name" tick={false} stroke="#6593EB" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} stroke="#6593EB"/>
                <Tooltip />
                <Bar dataKey="Previous" fill="#9dca82" />
                <Bar dataKey="Current" fill="#d884cd" />                
                <Line type="monotone" dataKey="Average" stroke="#ffc658" dot={false} isAnimationActive={false} />
                <ReferenceLine y={productivityData.Average} stroke="#ffc658" ifOverflow="extendDomain" strokeWidth={5}/>
                <text x={230} y={25} textAnchor="middle" fill="#000" stroke="#6593EB" fontSize="16">{team.name} Productivity</text>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    })}
  </div>
  );
};

export default EmotionIndex;