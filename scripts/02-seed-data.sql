-- Insert sample members
INSERT INTO members (name, email) VALUES
  ('Anjali', 'anjali@example.com'),
  ('Ashish', 'ashish@example.com'),
  ('He-man', 'heman@example.com'),
  ('Main hoon na', 'mainhoonha@example.com'),
  ('Gagan', 'gagan@example.com'),
  ('Kaushal', 'kaushal@example.com'),
  ('Rahul', 'rahul@example.com'),
  ('Kumar', 'kumar@example.com'),
  ('RK', 'rk@example.com'),
  ('Aswini', 'aswini@example.com')
ON CONFLICT (name) DO NOTHING;

-- Insert sample bookings for current and past dates
INSERT INTO bookings (member_id, booking_date, slot_number, status) VALUES
  -- Week of Sep 8 (past bookings)
  ((SELECT id FROM members WHERE name = 'Ashish'), '2025-09-08', 1, 'active'),
  ((SELECT id FROM members WHERE name = 'Anjali'), '2025-09-08', 2, 'active'),
  ((SELECT id FROM members WHERE name = 'He-man'), '2025-09-08', 3, 'active'),
  ((SELECT id FROM members WHERE name = 'Main hoon na'), '2025-09-08', 4, 'active'),
  ((SELECT id FROM members WHERE name = 'Gagan'), '2025-09-08', 5, 'active'),
  ((SELECT id FROM members WHERE name = 'Kaushal'), '2025-09-08', 6, 'active'),
  
  -- Tuesday Sep 9
  ((SELECT id FROM members WHERE name = 'Rahul'), '2025-09-09', 1, 'active'),
  ((SELECT id FROM members WHERE name = 'Anjali'), '2025-09-09', 2, 'active'),
  ((SELECT id FROM members WHERE name = 'Ashish'), '2025-09-09', 3, 'active'),
  ((SELECT id FROM members WHERE name = 'Kumar'), '2025-09-09', 4, 'active'),
  ((SELECT id FROM members WHERE name = 'He-man'), '2025-09-09', 5, 'active'),
  ((SELECT id FROM members WHERE name = 'RK'), '2025-09-09', 6, 'active'),
  
  -- Week of Sep 15 (future bookings)
  ((SELECT id FROM members WHERE name = 'Rahul'), '2025-09-15', 1, 'active'),
  ((SELECT id FROM members WHERE name = 'Kumar'), '2025-09-15', 2, 'active'),
  ((SELECT id FROM members WHERE name = 'RK'), '2025-09-15', 3, 'active'),
  ((SELECT id FROM members WHERE name = 'Anjali'), '2025-09-15', 4, 'active'),
  ((SELECT id FROM members WHERE name = 'Ashish'), '2025-09-15', 5, 'active'),
  ((SELECT id FROM members WHERE name = 'Kaushal'), '2025-09-15', 6, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample activity log entries
INSERT INTO activity_log (member_id, action_type, booking_date, slot_number, device_info) VALUES
  ((SELECT id FROM members WHERE name = 'Rahul'), 'booked', '2025-09-15', 1, 'Android 16 Pixel 9 Build/BP3A.250905.014 wv (Android 16) - Chrome'),
  ((SELECT id FROM members WHERE name = 'Kaushal'), 'booked', '2025-09-19', 1, 'Android 16 Pixel 9 Build/BP2A.250805.005 wv (Android 16) - Chrome'),
  ((SELECT id FROM members WHERE name = 'Kumar'), 'cancelled', '2025-09-04', 1, 'Android 10 K (Android 10) - Chrome'),
  ((SELECT id FROM members WHERE name = 'Ashish'), 'booked', '2025-09-03', 1, 'Android 10 K (Android 10) - Chrome')
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (member_id, comment_date, comment_text) VALUES
  ((SELECT id FROM members WHERE name = 'Kaushal'), '2025-09-12', 'What a fun day this was! Close games'),
  ((SELECT id FROM members WHERE name = 'Kaushal'), '2025-09-12', 'Did everyone have fun on Friday?')
ON CONFLICT DO NOTHING;
