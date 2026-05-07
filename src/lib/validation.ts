/**
 * FindaFlight — Input Validation
 *
 * Validates all user inputs before they reach SerpApi.
 * Supports comma-separated IATA codes, Google location IDs, and international searches.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate an airport code or comma-separated codes.
 * Accepts: 3-letter IATA codes, comma-separated IATA codes (JFK,LGA,EWR),
 * and Google location IDs (/m/... or /g/...).
 */
export function validateAirportCode(code: string, fieldName: string): ValidationError | null {
  if (!code || code.trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  const trimmed = code.trim();

  // Google location IDs (e.g., /m/0d6lp, /g/11bc5jmhng)
  if (trimmed.startsWith('/m/') || trimmed.startsWith('/g/')) {
    if (/^\/[mg]\/[a-z0-9_]+$/.test(trimmed)) {
      return null;
    }
    return { field: fieldName, message: `Invalid Google location ID: ${trimmed}` };
  }

  // Comma-separated IATA codes (e.g., JFK,LGA,EWR)
  const codes = trimmed.split(',').map(c => c.trim().toUpperCase());
  for (const c of codes) {
    if (!/^[A-Z]{3}$/.test(c)) {
      return { field: fieldName, message: `Invalid airport code: ${c}. Use 3-letter IATA codes (e.g., CID, MIA)` };
    }
  }

  return null;
}

/**
 * Validate a date string.
 * Must be YYYY-MM-DD format and not in the past.
 */
export function validateDate(date: string, fieldName: string, allowPast: boolean = false): ValidationError | null {
  if (!date || date.trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { field: fieldName, message: `${fieldName} must be in YYYY-MM-DD format` };
  }

  const parsed = new Date(date + 'T00:00:00');
  if (isNaN(parsed.getTime())) {
    return { field: fieldName, message: `${fieldName} is not a valid date` };
  }

  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed < today) {
      return { field: fieldName, message: `${fieldName} cannot be in the past` };
    }
  }

  return null;
}

/**
 * Validate the complete flight search request.
 */
export function validateSearchParams(params: {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  type?: number;
  travel_class?: number;
  adults?: number;
  children?: number;
  infants_in_seat?: number;
  infants_on_lap?: number;
  sort_by?: number;
  exclude_airlines?: string;
  include_airlines?: string;
  return_times?: string;
  exclude_basic?: boolean;
  gl?: string;
  mode?: string;
  includeNearby?: boolean;
  flexDates?: boolean;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  const originErr = validateAirportCode(params.origin || '', 'origin');
  if (originErr) errors.push(originErr);

  if (params.mode !== 'anywhere') {
    const destErr = validateAirportCode(params.destination || '', 'destination');
    if (destErr) errors.push(destErr);

    // Origin ≠ Destination (compare first code of comma-separated list)
    if (params.origin && params.destination) {
      const originFirst = params.origin.split(',')[0].trim().toUpperCase();
      const destFirst = params.destination.split(',')[0].trim().toUpperCase();
      if (originFirst === destFirst) {
        errors.push({ field: 'destination', message: 'Origin and destination cannot be the same' });
      }
    }
  }

  const dateErr = validateDate(params.departureDate || '', 'departureDate');
  if (dateErr) errors.push(dateErr);

  // Return date for round-trip
  if (params.type === 1 && !params.returnDate) {
    errors.push({ field: 'returnDate', message: 'Return date is required for round-trip searches' });
  }

  if (params.returnDate) {
    const retErr = validateDate(params.returnDate, 'returnDate');
    if (retErr) {
      errors.push(retErr);
    } else if (params.departureDate) {
      const dep = new Date(params.departureDate);
      const ret = new Date(params.returnDate);
      if (ret < dep) {
        errors.push({ field: 'returnDate', message: 'Return date must be after departure date' });
      }
    }
  }

  // Trip type
  if (params.type !== undefined && ![1, 2, 3].includes(params.type)) {
    errors.push({ field: 'type', message: 'Trip type must be 1 (round trip), 2 (one way), or 3 (multi-city)' });
  }

  // Travel class
  if (params.travel_class !== undefined && ![1, 2, 3, 4].includes(params.travel_class)) {
    errors.push({ field: 'travel_class', message: 'Travel class must be 1 (Economy), 2 (Premium Economy), 3 (Business), or 4 (First)' });
  }

  // Passenger counts
  if (params.adults !== undefined) {
    if (!Number.isInteger(params.adults) || params.adults < 1) {
      errors.push({ field: 'adults', message: 'At least 1 adult is required' });
    }
  }

  for (const [field, label] of [
    ['children', 'Children'],
    ['infants_in_seat', 'Infants in seat'],
    ['infants_on_lap', 'Infants on lap'],
  ] as const) {
    const val = params[field as keyof typeof params] as number | undefined;
    if (val !== undefined && (!Number.isInteger(val) || val < 0)) {
      errors.push({ field, message: `${label} count must be a non-negative integer` });
    }
  }

  // Sort by must match SerpApi values (1-13)
  if (params.sort_by !== undefined && (params.sort_by < 1 || params.sort_by > 13)) {
    errors.push({ field: 'sort_by', message: 'sort_by must be between 1 and 13' });
  }

  // Mutual exclusivity: exclude_airlines vs include_airlines
  if (params.exclude_airlines && params.include_airlines) {
    errors.push({
      field: 'airlines',
      message: 'Cannot use both exclude_airlines and include_airlines at the same time',
    });
  }

  // return_times only for round-trip
  if (params.return_times && params.type !== 1) {
    errors.push({ field: 'return_times', message: 'return_times should only be used for round-trip searches' });
  }

  // exclude_basic: only for domestic US economy — apply conditionally, not as hard error
  // (international searches simply ignore this parameter)

  return {
    valid: errors.length === 0,
    errors,
  };
}
