export interface PricingConfig {
  basePricePerArea: number; // Base price per postal area (e.g., 50€)
  hourlyRate: number; // Rate per hour (e.g., 100€/h)
  timeUnitMinutes: number; // Billing increment (e.g., 15 min)
}

// Default pricing - easily adjustable
export const DEFAULT_PRICING: PricingConfig = {
  basePricePerArea: 50,
  hourlyRate: 100,
  timeUnitMinutes: 15,
};

export interface PriceCalculationInput {
  estimatedTimeMinutes: number;
  bookingsInSameArea: number; // Number of bookings in same postal code
  pricingConfig?: PricingConfig;
}

export interface PriceCalculationResult {
  basePrice: number;
  basePricePerCustomer: number;
  hourlyComponent: number;
  totalPrice: number;
  discountMultiplier: number;
  bookingsCount: number;
}

/**
 * Calculate the price for a snow cleaning service
 * Formula: (basePrice / bookingsCount) + (hourlyRate * (timeMinutes / 60))
 */
export function calculatePrice({
  estimatedTimeMinutes,
  bookingsInSameArea,
  pricingConfig = DEFAULT_PRICING,
}: PriceCalculationInput): PriceCalculationResult {
  const bookingsCount = Math.max(1, bookingsInSameArea);
  const discountMultiplier = 1 / bookingsCount;

  const basePrice = pricingConfig.basePricePerArea;
  const basePricePerCustomer = basePrice * discountMultiplier;

  const hourlyComponent = pricingConfig.hourlyRate * (estimatedTimeMinutes / 60);

  const totalPrice = basePricePerCustomer + hourlyComponent;

  return {
    basePrice,
    basePricePerCustomer,
    hourlyComponent,
    totalPrice,
    discountMultiplier,
    bookingsCount,
  };
}

/**
 * Round time up to nearest time unit
 * E.g., 20 minutes with 15-min units = 30 minutes
 */
export function roundToTimeUnit(minutes: number, timeUnit: number = 15): number {
  return Math.ceil(minutes / timeUnit) * timeUnit;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)}€`;
}

/**
 * Get estimated time based on yard size category
 */
export function getEstimatedTime(yardSize: 'small' | 'medium' | 'large'): number {
  const timeMap = {
    small: 15,   // 0-200m² = 15 min
    medium: 30,  // 200-500m² = 30 min
    large: 45,   // 500m+ = 45 min
  };
  return timeMap[yardSize];
}
