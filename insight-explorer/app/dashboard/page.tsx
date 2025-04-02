// pages/dashboard.tsx

"use client";

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Define TypeScript interfaces for your data
interface CallData {
  id: number;
  sentiment: number;
  createdAt: string;
}

interface Campaign {
  id: number;
  name: string;
  description?: string;
  calls: CallData[];
}

export default function Dashboard() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    // Fetch campaigns data from your API endpoint
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCampaign(data[0]); // For now, use the first campaign
        }
      })
      .catch((error) => console.error('Error fetching campaigns:', error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Campaign Dashboard</h1>
      {campaign ? (
        <>
          <h2>{campaign.name}</h2>
          <p>{campaign.description}</p>
          <LineChart width={600} height={300} data={campaign.calls}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
          </LineChart>
        </>
      ) : (
        <p>Loading campaign data...</p>
      )}
    </div>
  );
}
