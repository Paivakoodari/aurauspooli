# Aurauspooli Database Schema (PostgreSQL)

## Tables

### users
Stores both customers and operators.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'operator')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
```

### postal_areas
Finnish postal code areas.

```sql
CREATE TABLE postal_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postal_code VARCHAR(5) NOT NULL UNIQUE,
  city VARCHAR(100) NOT NULL,
  area_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_postal_code ON postal_areas(postal_code);
```

### service_requests
Customer requests for snow cleaning.

```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  postal_code VARCHAR(5) NOT NULL REFERENCES postal_areas(postal_code),
  address TEXT NOT NULL,
  yard_size_category VARCHAR(20) NOT NULL CHECK (yard_size_category IN ('small', 'medium', 'large')),
  -- small = 0-200m², medium = 200-500m², large = 500m+
  estimated_time_minutes INT NOT NULL, -- e.g., 15, 30, 45, 60
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('hand', 'machine', 'both')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'completed', 'cancelled')),
  requested_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_service_requests_postal ON service_requests(postal_code);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_customer ON service_requests(customer_id);
CREATE INDEX idx_service_requests_date ON service_requests(requested_date);
```

### operator_services
Operator offerings for snow cleaning services.

```sql
CREATE TABLE operator_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  postal_code VARCHAR(5) NOT NULL REFERENCES postal_areas(postal_code),
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('hand', 'machine', 'both')),
  available BOOLEAN DEFAULT true,
  max_capacity_per_day INT, -- number of jobs they can handle per day
  equipment_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_operator_services_postal ON operator_services(postal_code);
CREATE INDEX idx_operator_services_operator ON operator_services(operator_id);
CREATE INDEX idx_operator_services_available ON operator_services(available);
```

### bookings
Confirmed bookings linking customers to operators.

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  operator_service_id UUID REFERENCES operator_services(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  actual_time_minutes INT, -- actual time spent
  base_price DECIMAL(10, 2) NOT NULL, -- base price per postal area
  hourly_rate DECIMAL(10, 2) NOT NULL, -- hourly rate
  discount_multiplier DECIMAL(5, 4) NOT NULL DEFAULT 1.0, -- e.g., 0.25 if 4 people in area
  final_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_request ON bookings(service_request_id);
CREATE INDEX idx_bookings_operator ON bookings(operator_service_id);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### pricing_config
Configurable pricing parameters.

```sql
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name VARCHAR(100) UNIQUE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 50.00, -- base price per postal area
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 100.00, -- rate per hour
  time_unit_minutes INT NOT NULL DEFAULT 15, -- billing increment (15 min)
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pricing_active ON pricing_config(is_active);
```

### postal_area_bookings_count
Materialized view or table for tracking concurrent bookings per postal code (for discount calculation).

```sql
CREATE TABLE postal_area_bookings_count (
  postal_code VARCHAR(5) NOT NULL,
  booking_date DATE NOT NULL,
  active_bookings_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (postal_code, booking_date),
  FOREIGN KEY (postal_code) REFERENCES postal_areas(postal_code)
);

CREATE INDEX idx_postal_bookings_date ON postal_area_bookings_count(booking_date);
```

## Business Logic Notes

### Pricing Calculation
1. Base price per postal area: configurable (default 50€)
2. Hourly rate: configurable (default 100€/h)
3. Time is calculated in 15-minute increments
4. Group discount: Base price is divided by number of bookings in same postal code on same day
   - Example: 4 bookings in postal code 00100 → each pays 50€/4 = 12.50€ base + hourly component
5. Final price = (base_price / booking_count) + (hourly_rate * (time_minutes / 60))

### Service Request Matching
- Operators register availability for specific postal codes
- System matches service requests to operators based on:
  - Postal code
  - Service type (hand/machine)
  - Operator capacity
  - Requested date

### Discount Triggers
- Discount is recalculated when:
  - New booking added for postal code + date
  - Booking cancelled for postal code + date
  - Uses `postal_area_bookings_count` table to track active bookings
