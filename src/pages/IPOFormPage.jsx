import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIPO } from "../api/ipoApi";

const initialForm = {
  name: "",
  ticker: "",
  exchange: "NSE",
  price_band_low: "",
  price_band_high: "",
  issue_size_crores: "",
  open_date: "",
  close_date: "",
  listing_date: "",
  underwriters: "",
  revenue_crores: "",
  ebitda_crores: "",
  pat_crores: "",
  roce_pct: "",
  pe: "",
  book_value: "",
  pb: "",
  business_description: "",
  geography_focus: "",
  management_summary: "",
  competitor_analysis: "",
  usp: "",
};

function IPOFormPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await createIPO(form);
      navigate(`/ipos/${created.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create IPO");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Add IPO</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Basics</legend>
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Ticker:
            <input name="ticker" value={form.ticker} onChange={handleChange} />
          </label>
          <label>
            Exchange:
            <select
              name="exchange"
              value={form.exchange}
              onChange={handleChange}
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="BOTH">Both</option>
            </select>
          </label>
          {/* Add price band, dates, issue size fields similarly */}
          <label>
            Price Band Low:
            <input
              name="price_band_low" value={form.price_band_low} onChange={handleChange}/>
          </label>  

          <label>
            Price Band High:
            <input
              name="price_band_high" value={form.price_band_high} onChange={handleChange}/>
          </label>
          <label>
            Issue Size (Cr):
            <input
              name="issue_size_crores"
              value={form.issue_size_crores}
              onChange={handleChange}
            />
            </label>
          <label>
            Open Date:
            <input
              type="date"
              name="open_date"
              value={form.open_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Close Date:
            <input
              type="date"
              name="close_date"
              value={form.close_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Listing Date:
            <input
              type="date"
              name="listing_date"
              value={form.listing_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Underwriters:
            <input
              name="underwriters"
              value={form.underwriters}
              onChange={handleChange}
            />
          </label>


        </fieldset>

        <fieldset>
          <legend>Financials</legend>
          <label>
            Revenue (Cr):
            <input
              name="revenue_crores"
              value={form.revenue_crores}
              onChange={handleChange}
            />
          </label>
          <label>
            EBITDA (Cr):
            <input
              name="ebitda_crores"
              value={form.ebitda_crores}
              onChange={handleChange}
            />
          </label>
          <label>
            PAT (Cr):
            <input
              name="pat_crores"
              value={form.pat_crores}
              onChange={handleChange}
            />
          </label>
          <label>
            ROCE (%):
            <input
              name="roce_pct"
              value={form.roce_pct}
              onChange={handleChange}
            />
          </label>
          <label>
            PE:
            <input name="pe" value={form.pe} onChange={handleChange} />
          </label>
          <label>
            Book Value:
            <input
              name="book_value"
              value={form.book_value}
              onChange={handleChange}
            />
          </label>
          <label>
            PB:
            <input name="pb" value={form.pb} onChange={handleChange} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Qualitative</legend>
          <label>
            Business Description:
            <textarea
              name="business_description"
              value={form.business_description}
              onChange={handleChange}
            />
          </label>
          <label>
            Geography Focus:
            <input
              name="geography_focus"
              value={form.geography_focus}
              onChange={handleChange}
            />
          </label>
          <label>
            Management Summary:
            <textarea
              name="management_summary"
              value={form.management_summary}
              onChange={handleChange}
            />
          </label>
          <label>
            Competitor Analysis:
            <textarea
              name="competitor_analysis"
              value={form.competitor_analysis}
              onChange={handleChange}
            />
          </label>
          <label>
            USP:
            <textarea name="usp" value={form.usp} onChange={handleChange} />
          </label>
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save IPO"}
        </button>
      </form>
    </div>
  );
}

export default IPOFormPage;
