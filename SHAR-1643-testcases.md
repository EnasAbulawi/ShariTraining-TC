# Test Cases — SHAR-1643: Admin Finance Cost & Revenue Insights

## TC-01: Default view loads correctly
- Preconditions: Logged in as Finance admin, dashboard page loaded
- Steps: Navigate to Finance dashboard
- Expected: View By defaults to Monthly; current year selected by default; all 4 KPI cards, chart, provider panel, and table render with data (or empty state if none)

## TC-02: View By toggle switches correctly (all 5 options)
- Preconditions: Dashboard loaded
- Steps: Click each View By option: Day, Weekly, Monthly, Quarterly, Year
- Expected: Active option is visually highlighted; all sections update simultaneously without page reload; period labels in table match selected granularity

## TC-03: Year filter changes scope correctly
- Preconditions: Multiple years of data exist
- Steps: Select a different year from Year dropdown
- Expected: All sections update to reflect only data within selected year; table rows limited to periods within that year

## TC-04: KPI card formulas are accurate
- Preconditions: Known dataset with calculable expected values
- Steps: Compare each KPI card value against manually calculated values using stated formulas
- Expected: GMV, Revenue, Cost of Revenue, Gross Profit all match documented formulas and example percentages

## TC-05: KPI card drill-down
- Preconditions: Dashboard loaded with data
- Steps: Click each of the 4 KPI cards
- Expected: Drills down to underlying transactions that compose that specific metric

## TC-06: Combined chart — series toggle
- Preconditions: Chart loaded with both series
- Steps: Toggle "Cost by period" checkbox off, then on
- Expected: Cost series (red) hides/shows without affecting Revenue series (blue)

## TC-07: Chart tooltip accuracy
- Preconditions: Chart loaded
- Steps: Hover over a data point
- Expected: Tooltip shows period label, Gross Revenue, Bureau Costs, Net Revenue — matches table for same period

## TC-08: Chart point drill-down
- Preconditions: Chart loaded
- Steps: Click a data point on the chart
- Expected: Drills down to all transactions in that specific period

## TC-09: Revenue by Provider panel — bar proportions & colors
- Preconditions: Data with multiple providers active
- Steps: View provider panel
- Expected: Correct fixed colors (Tabby=Blue, Tamara=Purple, Madfu=Green, MISPay=Amber, Sanad=Red); bar length proportional; sub-label shows revenue + %

## TC-10: Provider panel — zero revenue provider (edge case)
- Preconditions: A provider has 0 transactions in selected period
- Steps: Select a period/year where one provider has no activity
- Expected: [Flagged for PO] Verify whether provider is hidden or shown with 0%

## TC-11: Provider panel drill-down
- Preconditions: Provider panel loaded
- Steps: Click a provider row
- Expected: Drills down to that provider's transactions for the selected scope only

## TC-12: Period Summary Table — column accuracy & sorting
- Preconditions: Multiple periods of data exist
- Steps: View table across all periods
- Expected: Rows sorted chronologically ascending; all 7 columns populated correctly with colors (Revenue=blue, Cost=red, Gross Profit=green)

## TC-13: Negative Net Revenue row styling
- Preconditions: A period exists where bureau costs > revenue
- Steps: Locate that period's row
- Expected: Row displayed in red

## TC-14: Table drill-down (Gross Revenue, Bureau Costs, Net Revenue cells)
- Preconditions: Table loaded
- Steps: Click each clickable cell type in a row
- Expected: Opens drill-down of underlying transactions for that specific period and metric

## TC-15: Table granularity label updates
- Preconditions: Table loaded
- Steps: Switch View By between Day/Weekly/Monthly/Quarterly/Year
- Expected: Top-right label updates accordingly

## TC-16: Export reflects filtered view
- Preconditions: A specific View By + Year filter applied
- Steps: Click Export, open downloaded file
- Expected: File contains only currently filtered periods; all 7 columns present; values match on-screen exactly

## TC-17: Zero-transaction period (edge case)
- Preconditions: A period with no approved transactions exists within selected scope
- Steps: Navigate to that period's view
- Expected: [Flagged for PO] Empty state renders correctly; Net Margin shows 0% or "—", no division-by-zero error

## TC-18: Simultaneous update race condition (edge case)
- Preconditions: Dashboard loaded with a large dataset
- Steps: Rapidly switch View By or Year filter multiple times in quick succession
- Expected: No section shows stale/mismatched data from a previous filter state

## TC-19: Rounding/precision consistency
- Preconditions: Data producing non-round percentages
- Steps: Compare percentage values across KPI cards, tooltips, and table for the same period
- Expected: Rounding is consistent everywhere

## TC-20: Currency formatting
- Preconditions: Dashboard loaded
- Steps: Inspect SAR values across all sections
- Expected: Consistent thousands separators and decimal formatting throughout
