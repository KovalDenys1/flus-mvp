-- =============================================================================
-- FLUS MVP - Seed Demo Jobs
-- Description: Populate database with sample jobs for testing
-- Date: 2025-10-22
-- =============================================================================

-- This file is OPTIONAL - only run if you want sample data for testing

-- =============================================================================
-- SEED DEMO JOBS
-- =============================================================================

-- Get first user as demo employer
DO $$
DECLARE
  demo_employer_id TEXT;
BEGIN
  SELECT id INTO demo_employer_id FROM users LIMIT 1;
  
  IF demo_employer_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create a user first by logging in.';
  END IF;

  -- Insert demo jobs
  INSERT INTO jobs (
    title, 
    description, 
    category, 
    pay_nok, 
    duration_minutes, 
    area_name, 
    lat, 
    lng, 
    status, 
    employer_id, 
    address, 
    schedule_type, 
    payment_type
  )
  VALUES
    (
      'Hagearbeid – klipping', 
      'Klipp hekk og plen i bakgården. Ta med eget utstyr.', 
      'Gartneri', 
      350, 
      120, 
      'Oslo', 
      59.9139, 
      10.7522, 
      'open', 
      demo_employer_id, 
      'Bygdøy allé 5, 0257 Oslo', 
      'flexible', 
      'fixed'
    ),
    (
      'Flyttehjelp', 
      'Bære esker fra 3. etasje til bil. Ingen tung løfting.', 
      'Flytting', 
      400, 
      180, 
      'Oslo', 
      59.9275, 
      10.7611, 
      'open', 
      demo_employer_id, 
      'Markveien 32, 0554 Oslo', 
      'fixed', 
      'fixed'
    ),
    (
      'IT-hjelp – PC installasjon', 
      'Installere Windows og programmer på ny PC. Erfaring nødvendig.', 
      'IT-hjelp', 
      500, 
      120, 
      'Oslo', 
      59.9160, 
      10.7500, 
      'open', 
      demo_employer_id, 
      'Sofies gate 15, 0170 Oslo', 
      'flexible', 
      'fixed'
    ),
    (
      'Hundeluftning', 
      'Lufte hund 2x daglig i 30 min. Vennlig golden retriever.', 
      'Dyrepass', 
      200, 
      60, 
      'Oslo', 
      59.9200, 
      10.7350, 
      'open', 
      demo_employer_id, 
      'Frognerparken, Oslo', 
      'deadline', 
      'fixed'
    ),
    (
      'Snømåking', 
      'Måke snø fra oppkjørsel og fortau. Start når det snør.', 
      'Vedlikehold', 
      300, 
      90, 
      'Oslo', 
      59.9400, 
      10.7200, 
      'open', 
      demo_employer_id, 
      'Holmenkollveien 100, Oslo', 
      'flexible', 
      'fixed'
    ),
    (
      'Maling av rom', 
      'Male soverom (15m²). Maling og verktøy inkludert.', 
      'Bygg', 
      800, 
      240, 
      'Oslo', 
      59.9100, 
      10.7600, 
      'open', 
      demo_employer_id, 
      'Grønland 45, Oslo', 
      'fixed', 
      'fixed'
    ),
    (
      'Barnevakt', 
      'Passe 2 barn (5 og 8 år) fredag kveld kl 18-23.', 
      'Barnevakt', 
      600, 
      300, 
      'Oslo', 
      59.9300, 
      10.7100, 
      'open', 
      demo_employer_id, 
      'Majorstuen, Oslo', 
      'fixed', 
      'hourly'
    ),
    (
      'Rydding av garasje', 
      'Sortere og rydde garasje. Må kunne løfte tungt.', 
      'Rengjøring', 
      450, 
      180, 
      'Oslo', 
      59.9250, 
      10.7450, 
      'open', 
      demo_employer_id, 
      'Tøyen, Oslo', 
      'flexible', 
      'fixed'
    )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Successfully inserted 8 demo jobs for employer: %', demo_employer_id;
END $$;

-- Verify insertion
SELECT id, title, category, pay_nok, status FROM jobs ORDER BY created_at DESC LIMIT 10;

-- =============================================================================
-- SEED DATA COMPLETE ✅
-- =============================================================================
-- These are sample jobs for testing purposes only.
-- You can delete them later or add more as needed.
-- =============================================================================
