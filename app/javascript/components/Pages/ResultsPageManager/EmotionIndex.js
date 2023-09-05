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

  function truncateText(text, maxLength = 5) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  function happinessDescription(emotionIndex, currentEmotionIndex) {
    if (currentEmotionIndex < emotionIndex) {
      return "less happy";
    } else if (currentEmotionIndex > emotionIndex) {
      return "happier";
    } else {
      return "about the same";
    }
  }

  function productivityDescription(productivity, currentProductivity) {
    if (currentProductivity < productivity) {
        return "less";
    } else if (currentProductivity > productivity) {
        return "more";
    } else {
      return "about the same";
    }
}

function happinessChangeDescription(currentEmotionIndex, previousEmotionIndex) {
  if (currentEmotionIndex > previousEmotionIndex) {
    return "happier";
  } else if (currentEmotionIndex < previousEmotionIndex) {
    return "less happy";
  } else {
    return "about the same";
  }
}

function productivityChangeDescription(currentProductivity, previousProductivity) {
  if (currentProductivity > previousProductivity) {
    return "more";
  } else if (currentProductivity < previousProductivity) {
    return "less";
  } else {
    return "about the same";
  }
}

if(!nextTimePeriod && isMinUsersResponses) return <PreviewEmotionIndex />
return (
  <div>
    {teams.map(team => {
      const { emotionData, productivityData } = getDataForTeam(team);
      return (
        <div key={team.id}>
            {Number(team.previous_emotion_index) >= 0 && (
                <>
                  <div className='h5 w-auto text-start truncated fw-semibold calculate'>
                      <p className='grey'>The <span className="team-name">{team.name}</span> is feeling a <span className="team-name">{happinessChangeDescription(team.emotion_index_current_period || 0, team.previous_emotion_index || 0)}</span> than last week and <span className="team-name">{happinessDescription(team.emotion_index_all || 0, team.emotion_index_current_period || 0)}</span> than its average.</p>
                  </div>
                  <div className='h5 w-auto text-start truncated fw-semibold calculate'>
                      <p className='grey'> The <span className="team-name">{team.name}</span> is feeling a <span className="team-name">{productivityChangeDescription(team.productivity_average_current_period || 0, team.previous_productivity_average || 0)} </span> productive than last week and significantly <span className="team-name">{productivityDescription(team.productivity_average_all || 0, team.productivity_average_current_period || 0)}</span> than its average.</p>
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
                <Bar dataKey="Current" fill="#8884d8" />
                <Bar dataKey="Previous" fill="#82ca9d" />
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
                <Bar dataKey="Current" fill="#d884cd" />
                <Bar dataKey="Previous" fill="#9dca82" />
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