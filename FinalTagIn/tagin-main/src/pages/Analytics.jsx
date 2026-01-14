import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { TrendingUp, Shield, AlertTriangle, Activity, MapPin } from "lucide-react";

const BACKEND_BASE = "http://192.168.161.248:5000";
const MANUFACTURER_ADDRESS = "0x2557C4A84c5bE57dAD9c52F60a9c261141a01CED";

const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  neutral: "#64748b",
};

const SOURCE_COLORS = ["#0f172a", "#4ade80", "#6366f1"];

// Sample coordinates for cities (you can replace with real geocoding)
const CITY_COORDINATES = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
};

const Analytics = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (days) => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, heatmapRes] = await Promise.all([
        fetch(`${BACKEND_BASE}/api/analytics/scan-stats?manufacturer=${MANUFACTURER_ADDRESS}&days=${days}`).then(r => r.json()),
        fetch(`${BACKEND_BASE}/api/analytics/fake-heatmap?manufacturer=${MANUFACTURER_ADDRESS}&days=${days}`).then(r => r.json()),
      ]);

      setStats(statsRes);
      
      // Use static demo data if no real data is available
      const realHeatmap = heatmapRes?.heatmap || [];
      if (realHeatmap.length === 0) {
        // Static demo data for visualization
        setHeatmap([
          { city: "Mumbai", fakeScans: 145 },
          { city: "Delhi", fakeScans: 132 },
          { city: "Bangalore", fakeScans: 98 },
          { city: "Hyderabad", fakeScans: 87 },
          { city: "Chennai", fakeScans: 76 },
          { city: "Kolkata", fakeScans: 65 },
          { city: "Pune", fakeScans: 54 },
          { city: "Ahmedabad", fakeScans: 43 },
          { city: "Jaipur", fakeScans: 38 },
          { city: "Lucknow", fakeScans: 29 },
        ]);
      } else {
        setHeatmap(realHeatmap);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load analytics. Check backend /api/analytics/* endpoints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(rangeDays);
  }, [rangeDays]);

  const formatNumber = (n) =>
    typeof n === "number" ? n.toLocaleString() : n || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error Loading Data</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const scansBySource = stats?.scansBySource || {};
  const last7 = stats?.scansLast7Days || [];
  const topTokens = stats?.topTokens || [];

  // Prepare chart data
  const sourceData = [
    { name: "Manual Entry", value: scansBySource.manual || 0, color: SOURCE_COLORS[0] },
    { name: "NFC Tap", value: scansBySource.nfc || 0, color: SOURCE_COLORS[1] },
    { name: "Direct Link", value: scansBySource.link || 0, color: SOURCE_COLORS[2] },
  ].filter(item => item.value > 0);

  const trendData = last7.map((d) => ({
    date: d.date,
    Total: d.total,
    Verified: d.verified,
    Fake: d.fake,
  }));

  const tokenBarData = topTokens.slice(0, 8).map((t) => ({
    token: `#${t.tokenId.slice(0, 8)}...`,
    scans: t.total,
    fake: t.fake,
  }));

  // Prepare map data with coordinates
  const mapData = heatmap
    .filter(city => CITY_COORDINATES[city.city])
    .map(city => ({
      city: city.city,
      x: CITY_COORDINATES[city.city].lng,
      y: CITY_COORDINATES[city.city].lat,
      z: city.fakeScans,
      fakeScans: city.fakeScans,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Verification Analytics
          </h1>
          <p className="text-gray-600">
            Real-time insights into product authenticity verification
          </p>
        </div>

        {/* Range selector */}
        <div className="flex gap-3 mb-8">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRangeDays(d)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                rangeDays === d
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/50 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Total Scans"
            value={formatNumber(stats.totalScans)}
            color="indigo"
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            label="Verified Scans"
            value={formatNumber(stats.verifiedScans)}
            color="green"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Fake Scans"
            value={formatNumber(stats.fakeScans)}
            color="red"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Verification Rate"
            value={`${stats.verificationRate.toFixed(1)}%`}
            color="blue"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Trend Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Scan Activity Trend
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Daily breakdown over the last 7 days
            </p>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Total"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Verified"
                    stroke={COLORS.success}
                    strokeWidth={3}
                    dot={{ fill: COLORS.success, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Fake"
                    stroke={COLORS.danger}
                    strokeWidth={3}
                    dot={{ fill: COLORS.danger, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No activity data available</p>
            )}
          </div>

          {/* Pie Chart - Scans by Source */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Scans by Source
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              How users verify products
            </p>
            {sourceData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {sourceData.map((item, idx) => {
                    const percent = stats.totalScans > 0
                      ? Math.round((item.value / stats.totalScans) * 100)
                      : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-20">No source data available</p>
            )}
          </div>
        </div>

        {/* Charts Row 2 - Map + Top Tokens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Geographic Scatter Map */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Counterfeit Hotspots Map
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Geographic distribution of fake scans {heatmap.length === 10 && "(Demo Data)"}
            </p>
            {mapData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Longitude"
                    domain={[68, 88]}
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                    label={{ value: 'Longitude', position: 'bottom', style: { fontSize: '12px', fill: '#6b7280' } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Latitude"
                    domain={[8, 32]}
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                    label={{ value: 'Latitude', angle: -90, position: 'left', style: { fontSize: '12px', fill: '#6b7280' } }}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Fake Scans" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-900 mb-1">{data.city}</p>
                            <p className="text-sm text-red-600">
                              {data.fakeScans} fake scans
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter
                    data={mapData}
                    fill="#ef4444"
                    fillOpacity={0.6}
                    stroke="#dc2626"
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  No geographic data available yet
                </p>
              </div>
            )}
          </div>

          {/* Bar Chart - Top Tokens */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Most Scanned Products
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Token IDs with highest activity
            </p>
            {tokenBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={tokenBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="token"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="scans" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fake" fill={COLORS.danger} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No token data available</p>
            )}
          </div>
        </div>

        {/* Charts Row 3 - India Heatmap */}
        <div className="grid grid-cols-1 gap-6">
          {/* India Map Heatmap Visualization */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              India Counterfeit Heatmap {heatmap.length === 10 && "(Demo Data)"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Visual intensity map showing fake scan distribution across India
            </p>
            {heatmap.length > 0 ? (
              <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl overflow-hidden border border-gray-200">
                {/* India Map with Heatmap */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
                  {/* India Map Outline - More Detailed */}
                  <path
                    d="M 350 80 L 420 85 L 480 95 L 530 110 L 570 135 L 600 170 L 615 210 L 625 250 L 630 290 L 625 330 L 615 370 L 595 410 L 570 450 L 540 490 L 500 530 L 455 565 L 405 590 L 350 605 L 295 600 L 250 580 L 220 550 L 200 510 L 190 465 L 185 415 L 180 365 L 175 315 L 180 265 L 195 215 L 220 170 L 255 130 L 300 95 L 350 80 Z
                     M 630 290 L 645 285 L 655 295 L 650 310 L 635 315 Z
                     M 320 590 L 310 600 L 300 595 L 305 585 Z"
                    fill="#e0e7ff"
                    stroke="#6366f1"
                    strokeWidth="3"
                    opacity="0.4"
                  />
                  
                  {/* State borders (simplified) */}
                  <g stroke="#93c5fd" strokeWidth="1" opacity="0.3" fill="none">
                    <path d="M 350 80 L 400 200 L 380 280" />
                    <path d="M 480 95 L 500 180 L 520 260" />
                    <path d="M 570 135 L 540 220 L 510 300" />
                    <path d="M 220 170 L 280 240 L 300 320" />
                    <path d="M 350 400 L 420 420 L 480 400" />
                  </g>
                  
                  {/* Heatmap Overlays */}
                  {mapData.map((point, idx) => {
                    const maxScans = Math.max(...mapData.map(p => p.fakeScans));
                    const intensity = point.fakeScans / maxScans;
                    const radius = 30 + (intensity * 50);
                    const opacity = 0.25 + (intensity * 0.6);
                    
                    // Convert lat/lng to SVG coordinates with better mapping
                    const x = 200 + ((point.x - 68) / 20) * 400;
                    const y = 700 - ((point.y - 8) / 24) * 600;
                    
                    // Color gradient from yellow to red based on intensity
                    const color = intensity > 0.7 ? '#dc2626' : 
                                 intensity > 0.4 ? '#f97316' : '#fbbf24';
                    
                    return (
                      <g key={idx}>
                        {/* Large outer glow for heat effect */}
                        <circle
                          cx={x}
                          cy={y}
                          r={radius * 1.8}
                          fill={color}
                          opacity={opacity * 0.15}
                          className="animate-pulse"
                          style={{ animationDuration: `${2 + intensity}s` }}
                        />
                        {/* Middle heat layer */}
                        <circle
                          cx={x}
                          cy={y}
                          r={radius * 1.2}
                          fill={color}
                          opacity={opacity * 0.3}
                        />
                        {/* Main heat circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={radius}
                          fill={color}
                          opacity={opacity}
                          stroke={color}
                          strokeWidth="2"
                        />
                        {/* Hot center */}
                        <circle
                          cx={x}
                          cy={y}
                          r={radius * 0.3}
                          fill="#7c2d12"
                          opacity={Math.min(1, opacity + 0.3)}
                        />
                        
                        {/* City name and count */}
                        <text
                          x={x}
                          y={y + radius + 18}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontSize="13"
                          fontWeight="700"
                          style={{ 
                            textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                          }}
                        >
                          {point.city}
                        </text>
                        <text
                          x={x}
                          y={y + radius + 32}
                          textAnchor="middle"
                          fill="#dc2626"
                          fontSize="11"
                          fontWeight="600"
                          style={{ 
                            textShadow: '0 0 3px white, 0 0 3px white',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                          }}
                        >
                          {point.fakeScans} fakes
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Enhanced Legend */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Heat Intensity
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500"></div>
                      <span className="text-xs text-gray-700 font-medium">Low Risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-orange-600"></div>
                      <span className="text-xs text-gray-700 font-medium">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-red-700"></div>
                      <span className="text-xs text-gray-700 font-medium">High Risk</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Circle size = scan volume
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  No city-level data yet. Start sending location data to see hotspots.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-emerald-500 to-emerald-600",
    red: "from-rose-500 to-rose-600",
    blue: "from-blue-500 to-blue-600",
  };

  const bgColors = {
    indigo: "bg-indigo-50",
    green: "bg-emerald-50",
    red: "bg-rose-50",
    blue: "bg-blue-50",
  };

  const iconColors = {
    indigo: "text-indigo-600",
    green: "text-emerald-600",
    red: "text-rose-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColors[color]} p-3 rounded-xl ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default Analytics;