import { useEffect, useState } from "react";
        <div style={{ marginRight: 20 }}>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={syncing}
            style={{
              padding: "8px 14px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
            title="Sync IPO listings from IPO Alerts"
          >
            {syncing ? "Syncing..." : "Sync with IPO Alerts"}
          </button>

          <div style={{ fontSize: 12, color: "#444", marginTop: 6 }}>
            <div>
              Successful syncs today: <strong>{syncStats.success_today}</strong>
            </div>
            <div>
              Successful syncs this month: <strong>{syncStats.success_month}</strong>
            </div>
          </div>

          {showConfirm && (
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: 20,
                  borderRadius: 8,
                  width: 380,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Confirm Sync</h3>
                <p style={{ marginBottom: 12 }}>
                  This will fetch IPOs from the remote API and persist them.
                  Proceed?
                </p>

                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12 }}>Days ahead</label>
                    <input
                      type="number"
                      value={confirmDays}
                      onChange={(e) => setConfirmDays(Number(e.target.value))}
                      style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                  </div>
                  <div style={{ width: 110 }}>
                    <label style={{ fontSize: 12 }}>Page</label>
                    <input
                      type="number"
                      value={confirmPage}
                      onChange={(e) => setConfirmPage(Number(e.target.value))}
                      style={{ width: "100%", padding: 8, marginTop: 4 }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    onClick={() => setShowConfirm(false)}
                    style={{ padding: "8px 12px", borderRadius: 6 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSync(confirmDays, confirmPage)}
                    disabled={syncing}
                    style={{
                      padding: "8px 12px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                    }}
                  >
                    {syncing ? "Syncing..." : "Confirm & Sync"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
              padding: "8px 14px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
            title="Sync IPO listings from IPO Alerts"
          >
            {syncing ? "Syncing..." : "Sync with IPO Alerts"}
          </button>
          <div style={{ fontSize: 12, color: "#444", marginTop: 6 }}>
            <div>
              Successful syncs today: <strong>{syncStats.success_today}</strong>
            </div>
            <div>
              Successful syncs this month:{" "}
              <strong>{syncStats.success_month}</strong>
            </div>
          </div>
        </div>
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
            <th
              style={{
                padding: "12px 15px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              Actions
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
              <td style={{ padding: "12px 15px", textAlign: "center" }}>
                <Link
                  to={`/ipos/${ipo.id}/edit`}
                  style={{
                    color: "#4CAF50",
                    fontSize: "18px",
                    marginRight: "12px",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  title="Edit"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${ipo.name}?`)) {
                      console.log(`Delete IPO ${ipo.id}`);
                      alert("Delete functionality coming soon");
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f44336",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0",
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IPOListPage;
