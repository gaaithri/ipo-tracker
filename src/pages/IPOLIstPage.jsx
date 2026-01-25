import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchIPOs } from "../api/ipoApi";

function IPOListPage() {
  const [ipos, setIPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchangeFilter, setExchangeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const LOW_PE_THRESHOLD = 15;
  const MEDIUM_PE_THRESHOLD = 40;
  const HIGH_PE_THRESHOLD = 60;

  const getIPOStatus = (openDate, closeDate) => {
    const today = new Date();
    const open = new Date(openDate);
    const close = new Date(closeDate);

    if (close < today) {
      return "Listed";
    } else if (open > today) {
      return "Upcoming";
    } else {
      return "Open";
    }
  };

  useEffect(() => {
    fetchIPOs()
      .then(setIPOs)
      .finally(() => setLoading(false));
  }, []);

  // Get unique exchanges and normalize them
  const uniqueExchanges = [
    ...new Set(ipos.map((ipo) => ipo.exchange.toUpperCase())),
  ].sort();

  // Get unique statuses
  const uniqueStatuses = [
    ...new Set(ipos.map((ipo) => getIPOStatus(ipo.open_date, ipo.close_date))),
  ].sort();

  // Filter IPOs based on selected exchange and status
  const filteredIPOs = ipos.filter((ipo) => {
    const exchange = ipo.exchange.toUpperCase();
    const status = getIPOStatus(ipo.open_date, ipo.close_date);

    const exchangeMatch = !exchangeFilter || exchange === exchangeFilter;
    const statusMatch = !statusFilter || status === statusFilter;

    return exchangeMatch && statusMatch;
  });

  if (loading) return <p>Loading IPOs...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>IPO List</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label style={{ fontWeight: "bold", fontSize: "14px" }}>
          Filter by Exchange:
        </label>
        <select
          value={exchangeFilter}
          onChange={(e) => setExchangeFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="">All Exchanges</option>
          {uniqueExchanges.map((exchange) => (
            <option key={exchange} value={exchange}>
              {exchange}
            </option>
          ))}
        </select>

        <label style={{ fontWeight: "bold", fontSize: "14px" }}>
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="">All Status</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {(exchangeFilter || statusFilter) && (
          <span style={{ fontSize: "12px", color: "#666" }}>
            Showing {filteredIPOs.length} IPO(s)
          </span>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Ticker
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Exchange
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              Rating
            </th>

            <th
              style={{
                padding: "12px 15px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Open
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Close
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              PE
            </th>
            <th
              style={{
                padding: "12px 15px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              ROCE %
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredIPOs.map((ipo) => (
            <tr
              key={ipo.id}
              style={{
                borderBottom: "1px solid #ddd",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <td style={{ padding: "12px 15px" }}>
                <Link
                  to={`/ipos/${ipo.id}`}
                  style={{ color: "#4CAF50", textDecoration: "none" }}
                >
                  {ipo.name}
                </Link>
              </td>
              <td style={{ padding: "12px 15px" }}>{ipo.ticker}</td>
              <td
                style={
                  ipo.exchange.toUpperCase() !== "BOTH"
                    ? {
                        backgroundColor: "blue",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }
                    : {
                        backgroundColor: "lightgrey",
                        color: "brown",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }
                }
              >
                {ipo.exchange.toUpperCase()}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                3
              </td>
              <td>{getIPOStatus(ipo.open_date, ipo.close_date)}</td>
              <td style={{ padding: "12px 15px", textAlign: "center" }}>
                {ipo.open_date}
              </td>
              <td style={{ padding: "12px 15px", textAlign: "center" }}>
                {ipo.close_date}
              </td>
              <td
                style={
                  ipo.pe === 0 || ipo.pe === null || ipo.pe === ""
                    ? {
                        backgroundColor: "gray",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }
                    : ipo.pe < LOW_PE_THRESHOLD
                      ? {
                          backgroundColor: "green",
                          color: "white",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          textAlign: "center",
                        }
                      : ipo.pe < MEDIUM_PE_THRESHOLD
                        ? {
                            backgroundColor: "orange",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            textAlign: "center",
                          }
                        : ipo.pe < HIGH_PE_THRESHOLD
                          ? {
                              backgroundColor: "red",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }
                          : {
                              backgroundColor: "purple",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }
                }
              >
                {ipo.pe === 0 || ipo.pe === null || ipo.pe === ""
                  ? "N/A"
                  : ipo.pe < LOW_PE_THRESHOLD
                    ? `${ipo.pe} ⭐`
                    : ipo.pe}
              </td>
              <td style={{ padding: "12px 15px", textAlign: "center" }}>
                {ipo.roce_pct}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IPOListPage;
