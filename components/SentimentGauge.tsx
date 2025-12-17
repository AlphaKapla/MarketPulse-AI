
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';

interface SentimentGaugeProps {
  score: number;
  label: string;
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score, label }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const getColor = (val: number) => {
    if (val < 40) return '#ef4444'; // Red
    if (val < 60) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const sentimentText = score > 60 ? 'Bullish' : score < 40 ? 'Bearish' : 'Neutral';

  return (
    <div className="flex flex-col items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700 shadow-xl transition-all hover:scale-105">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</h3>
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={getColor(score)} stroke="none" />
              <Cell fill="#1e293b" stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-12">
        <div className="text-3xl font-bold" style={{ color: getColor(score) }}>{score}</div>
        <div className="text-xs font-medium text-slate-500 uppercase">{sentimentText}</div>
      </div>
    </div>
  );
};

export default SentimentGauge;
