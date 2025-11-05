-- Enable realtime for admin dashboard tables

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- Enable realtime for jobs table  
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Enable realtime for bedrift table
ALTER PUBLICATION supabase_realtime ADD TABLE bedrift;

-- Enable realtime for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
