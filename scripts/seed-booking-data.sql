-- Insert sample members
INSERT INTO members (name, email, avatar_color) VALUES
('Alex Chen', 'alex.chen@email.com', '#3B82F6'),
('Sarah Johnson', 'sarah.johnson@email.com', '#10B981'),
('Mike Rodriguez', 'mike.rodriguez@email.com', '#F59E0B'),
('Emily Davis', 'emily.davis@email.com', '#EF4444'),
('David Kim', 'david.kim@email.com', '#8B5CF6'),
('Lisa Wang', 'lisa.wang@email.com', '#06B6D4'),
('Tom Wilson', 'tom.wilson@email.com', '#84CC16'),
('Anna Martinez', 'anna.martinez@email.com', '#F97316')
ON CONFLICT (email) DO NOTHING;

-- Insert sample bookings for the next few days
INSERT INTO bookings (member_id, booking_date) VALUES
(1, CURRENT_DATE),
(2, CURRENT_DATE),
(3, CURRENT_DATE + INTERVAL '1 day'),
(4, CURRENT_DATE + INTERVAL '1 day'),
(5, CURRENT_DATE + INTERVAL '2 days'),
(1, CURRENT_DATE + INTERVAL '3 days'),
(6, CURRENT_DATE + INTERVAL '4 days'),
(7, CURRENT_DATE + INTERVAL '5 days')
ON CONFLICT (member_id, booking_date) DO NOTHING;

-- Insert sample activity log entries
INSERT INTO activity_log (member_id, action, booking_date, device_info) VALUES
(1, 'booked', CURRENT_DATE, 'iPhone 15 Pro'),
(2, 'booked', CURRENT_DATE, 'Samsung Galaxy S24'),
(3, 'booked', CURRENT_DATE + INTERVAL '1 day', 'MacBook Pro'),
(4, 'cancelled', CURRENT_DATE - INTERVAL '1 day', 'iPad Air'),
(5, 'booked', CURRENT_DATE + INTERVAL '2 days', 'iPhone 14'),
(6, 'booked', CURRENT_DATE + INTERVAL '4 days', 'Pixel 8 Pro')
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (member_id, comment_date, content) VALUES
(1, CURRENT_DATE, 'Looking forward to today''s game!'),
(2, CURRENT_DATE + INTERVAL '1 day', 'Can we start 30 minutes earlier tomorrow?'),
(3, CURRENT_DATE + INTERVAL '2 days', 'Bringing new rackets to try out'),
(4, CURRENT_DATE + INTERVAL '3 days', 'Weather looks perfect for badminton')
ON CONFLICT DO NOTHING;
