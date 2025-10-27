-- =============================================================================
-- FLUS MVP - Create Test Users and Job for Chat Testing
-- Description: Create two test users and a job for testing chat functionality
-- Date: 2025-10-27
-- =============================================================================

-- Create test employer
INSERT INTO users (id, email, role, navn, kommune)
VALUES
  ('test_employer_1', 'employer@test.com', 'employer', 'Test Arbeidsgiver', 'Oslo')
ON CONFLICT (id) DO NOTHING;

-- Create test worker
INSERT INTO users (id, email, role, navn, kommune)
VALUES
  ('test_worker_1', 'worker@test.com', 'worker', 'Test Arbeider', 'Oslo')
ON CONFLICT (id) DO NOTHING;

-- Create test job
INSERT INTO jobs (
  id,
  employer_id,
  title,
  description,
  category,
  pay_nok,
  duration_minutes,
  area_name,
  lat,
  lng,
  status,
  selected_worker_id,
  address,
  schedule_type,
  payment_type
)
VALUES
  (
    'test_job_chat',
    'test_employer_1',
    'Test Chat Job',
    'Job for testing chat between employer and worker',
    'IT-hjelp',
    500,
    120,
    'Oslo',
    59.9139,
    10.7522,
    'assigned',
    'test_worker_1',
    'Test Address 123, Oslo',
    'flexible',
    'fixed'
  )
ON CONFLICT (id) DO UPDATE SET
  status = 'assigned',
  selected_worker_id = 'test_worker_1';

-- Create application from worker to job
INSERT INTO applications (id, job_id, applicant_id, status, message)
VALUES
  (
    'test_application_chat',
    'test_job_chat',
    'test_worker_1',
    'accepted',
    'Jeg er interessert i denne jobben for å teste chat.'
  )
ON CONFLICT (id) DO UPDATE SET status = 'accepted';

-- Create conversation for chat
INSERT INTO conversations (id, job_id, worker_id, employer_id)
VALUES
  (
    'test_conversation_chat',
    'test_job_chat',
    'test_worker_1',
    'test_employer_1'
  )
ON CONFLICT (id) DO NOTHING;

-- Add some test messages
INSERT INTO messages (id, conversation_id, sender_id, message_type, text_content, created_at)
VALUES
  (
    'test_msg_1',
    'test_conversation_chat',
    'test_employer_1',
    'text',
    'Hei! Du har blitt valgt til denne jobben. Når kan du starte?',
    NOW() - INTERVAL '10 minutes'
  ),
  (
    'test_msg_2',
    'test_conversation_chat',
    'test_worker_1',
    'text',
    'Hei! Takk for at du valgte meg. Jeg kan starte i morgen kl 10.',
    NOW() - INTERVAL '8 minutes'
  ),
  (
    'test_msg_3',
    'test_conversation_chat',
    'test_employer_1',
    'text',
    'Perfekt! Send meg et bilde før du starter arbeidet.',
    NOW() - INTERVAL '5 minutes'
  ),
  (
    'test_msg_4',
    'test_conversation_chat',
    'test_worker_1',
    'text',
    'Her er et bilde før jeg starter:',
    NOW() - INTERVAL '2 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- Show created data
SELECT 'Users created:' as info, COUNT(*) as count FROM users WHERE id LIKE 'test_%';
SELECT 'Job created:' as info, id, title FROM jobs WHERE id = 'test_job_chat';
SELECT 'Application created:' as info, id, status FROM applications WHERE id = 'test_application_chat';
SELECT 'Conversation created:' as info, id FROM conversations WHERE id = 'test_conversation_chat';
SELECT 'Messages created:' as info, COUNT(*) as count FROM messages WHERE conversation_id = 'test_conversation_chat';

-- Create COMPLETED job for testing confirmation
INSERT INTO jobs (
  id,
  employer_id,
  title,
  description,
  category,
  pay_nok,
  duration_minutes,
  area_name,
  lat,
  lng,
  status,
  selected_worker_id,
  address,
  schedule_type,
  payment_type
)
VALUES
  (
    'test_job_completed',
    'test_employer_1',
    'Completed Test Job',
    'Job for testing work completion confirmation',
    'Hagearbeid',
    300,
    60,
    'Oslo',
    59.9139,
    10.7522,
    'completed',
    'test_worker_1',
    'Test Address 456, Oslo',
    'flexible',
    'fixed'
  )
ON CONFLICT (id) DO UPDATE SET
  status = 'completed',
  selected_worker_id = 'test_worker_1';

-- Create application for completed job
INSERT INTO applications (id, job_id, applicant_id, status, message, work_completed_at)
VALUES
  (
    'test_application_completed',
    'test_job_completed',
    'test_worker_1',
    'completed',
    'Jobben er fullført!',
    NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT (id) DO UPDATE SET
  status = 'completed',
  work_completed_at = NOW() - INTERVAL '30 minutes';

-- Create conversation for completed job
INSERT INTO conversations (id, job_id, worker_id, employer_id)
VALUES
  (
    'test_conversation_completed',
    'test_job_completed',
    'test_worker_1',
    'test_employer_1'
  )
ON CONFLICT (id) DO NOTHING;

-- Add messages for completed job
INSERT INTO messages (id, conversation_id, sender_id, message_type, text_content, system_event, created_at)
VALUES
  (
    'test_msg_completed_1',
    'test_conversation_completed',
    'test_worker_1',
    'text',
    'Jeg har fullført arbeidet! Her er bilde etter:',
    null,
    NOW() - INTERVAL '35 minutes'
  ),
  (
    'test_msg_completed_2',
    'test_conversation_completed',
    'test_worker_1',
    'system',
    null,
    'work_completed',
    NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- TEST DATA CREATED ✅
-- =============================================================================
-- ASSIGNED job (for testing work completion and photo upload):
-- Job ID: test_job_chat
-- Conversation ID: test_conversation_chat
-- Worker can: Complete work, Send photos
-- Employer can: Wait for completion
--
-- COMPLETED job (for testing confirmation):
-- Job ID: test_job_completed
-- Conversation ID: test_conversation_completed
-- Employer can: Confirm completion
--
-- Test users:
-- Employer: test_employer_1
-- Worker: test_worker_1
-- =============================================================================</content>
<parameter name="filePath">c:\Users\Denys\Documents\flus-mvp\supabase\create_test_chat_data.sql