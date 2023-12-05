CREATE TABLE sent_emails ()
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT 0,
  completed_at VARCHAR(255)
);
