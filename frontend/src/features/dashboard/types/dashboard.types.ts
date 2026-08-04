// NOTE: node-postgres returns COUNT()/SUM() results as strings unless
// a custom type parser is configured (a very common gotcha with raw
// SQL aggregate views like these). Typing these as `number | string`
// so the frontend has to consciously coerce rather than silently
// calling .toLocaleString() on a string and getting away with it by
// accident (strings have toLocaleString() too, but it doesn't format
// numerically — e.g. "12".toLocaleString() === "12", no thousands
// separators, no currency formatting).
type NumericValue = number | string;

export interface SyndicDashboardData {
  syndic_id: string;
  syndic_name: string;
  total_residences: NumericValue;
  total_apartments: NumericValue;
  available_apartments: NumericValue;
  total_owners: NumericValue;
  pending_charges: NumericValue;
  pending_amount: NumericValue;
  open_incidents: NumericValue;
  pending_reservations: NumericValue;
  todays_rdv: NumericValue;
}

export interface AdminDashboardData {
  total_syndics: NumericValue;
  total_owners: NumericValue;
  total_visitors: NumericValue;
  total_residences: NumericValue;
  total_apartments: NumericValue;
  available_apartments: NumericValue;
  open_incidents: NumericValue;
  pending_reservations: NumericValue;
}