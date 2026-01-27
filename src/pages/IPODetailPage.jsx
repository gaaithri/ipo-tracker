import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchIPO } from "../api/ipoApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function IPODetailPage() {
  const { id } = useParams();
  const [ipo, setIPO] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIPO(id)
      .then(setIPO)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading IPO...</p>;
  if (!ipo) return <p>IPO not found</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>
          {ipo.name} ({ipo.ticker})
        </h1>
        <Link
          to={`/ipos/${id}/edit`}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Edit IPO
        </Link>
      </div>

      <section>
        <h2>Basics</h2>
        <p>Exchange: {ipo.exchange}</p>
        <p>
          Price band: {ipo.price_band_low} – {ipo.price_band_high}
        </p>
        <p>Issue size: {ipo.issue_size_crores} Cr</p>
        <p>Open: {ipo.open_date}</p>
        <p>Close: {ipo.close_date}</p>
        <p>Listing: {ipo.listing_date}</p>
        <p>Underwriters: {ipo.underwriters}</p>
      </section>

      <section>
        <h2>Valuation</h2>
        <p>EPS: {ipo.eps}</p>
        <p>PE: {ipo.pe}</p>
        <p>Book value: {ipo.book_value}</p>
        <p>P/B: {ipo.pb}</p>
        <p>Valuation comment: {ipo.valuation_comment}</p>
      </section>

      <section>
        <h2>Financial Metrics</h2>
        {ipo.revenue_crores || ipo.ebitda_crores || ipo.pat_crores ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Financial Metrics",
                  Revenue: parseFloat(ipo.revenue_crores) || 0,
                  EBITDA: parseFloat(ipo.ebitda_crores) || 0,
                  PAT: parseFloat(ipo.pat_crores) || 0,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Amount (Cr)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)} Cr`} />
              <Legend />
              <Bar dataKey="Revenue" fill="#4CAF50" />
              <Bar dataKey="EBITDA" fill="#2196F3" />
              <Bar dataKey="PAT" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Financial data not available</p>
        )}
      </section>

      <section>
        <h2>Qualitative</h2>
        <p>
          <strong>Business:</strong> {ipo.business_description}
        </p>
        <p>
          <strong>Geography:</strong> {ipo.geography_focus}
        </p>
        <p>
          <strong>Management:</strong> {ipo.management_summary}
        </p>
        <p>
          <strong>Competition:</strong> {ipo.competitor_analysis}
        </p>
        <p>
          <strong>USP:</strong> {ipo.usp}
        </p>
      </section>
    </div>
  );
}

export default IPODetailPage;
