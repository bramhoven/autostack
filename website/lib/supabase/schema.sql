-- Create tables
CREATE TABLE software (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  version TEXT NOT NULL,
  image_url TEXT NOT NULL,
  requirements TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE servers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  ssh_port TEXT NOT NULL DEFAULT '22',
  username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  uptime TEXT,
  load TEXT,
  disk TEXT,
  memory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE installations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  server_id INTEGER REFERENCES servers(id) NOT NULL,
  software_id INTEGER REFERENCES software(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  version TEXT NOT NULL,
  uptime TEXT,
  memory TEXT,
  cpu TEXT,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;

-- Servers policies
CREATE POLICY "Users can view their own servers"
  ON servers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own servers"
  ON servers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own servers"
  ON servers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own servers"
  ON servers FOR DELETE
  USING (auth.uid() = user_id);

-- Installations policies
CREATE POLICY "Users can view their own installations"
  ON installations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own installations"
  ON installations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installations"
  ON installations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own installations"
  ON installations FOR DELETE
  USING (auth.uid() = user_id);

-- Software table is public for all authenticated users
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view software"
  ON software FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO software (name, description, long_description, category, version, image_url, requirements, popular)
VALUES 
  ('Nginx', 'High-performance HTTP server and reverse proxy', 'NGINX is a free, open-source, high-performance HTTP server and reverse proxy, as well as an IMAP/POP3 proxy server. NGINX is known for its high performance, stability, rich feature set, simple configuration, and low resource consumption.', 'web-server', '1.22.1', '/placeholder.svg?height=80&width=80', 'Linux server with at least 512MB RAM', true),
  
  ('PostgreSQL', 'Advanced open source relational database', 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.', 'database', '14.5', '/placeholder.svg?height=80&width=80', 'Linux server with at least 1GB RAM', true),
  
  ('Redis', 'In-memory data structure store', 'Redis is an open source, in-memory data structure store, used as a database, cache, and message broker. Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.', 'database', '7.0.5', '/placeholder.svg?height=80&width=80', 'Linux server with at least 512MB RAM', false),
  
  ('Node.js', 'JavaScript runtime built on Chrome\'s V8 engine', 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.', 'runtime', '18.12.1', '/placeholder.svg?height=80&width=80', 'Linux server with at least 512MB RAM', true),
  
  ('Docker', 'Platform for developing, shipping, and running applications', 'Docker is a platform designed to help developers build, share, and run modern applications. Docker handles the tedious setup, so you can focus on the code.', 'container', '20.10.21', '/placeholder.svg?height=80&width=80', 'Linux server with at least 1GB RAM', true),
  
  ('MongoDB', 'Document-oriented NoSQL database', 'MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.', 'database', '6.0.3', '/placeholder.svg?height=80&width=80', 'Linux server with at least 1GB RAM', false),
  
  ('Apache', 'Cross-platform web server software', 'The Apache HTTP Server is a free and open-source cross-platform web server software. Apache is developed and maintained by an open community of developers under the auspices of the Apache Software Foundation.', 'web-server', '2.4.54', '/placeholder.svg?height=80&width=80', 'Linux server with at least 512MB RAM', false),
  
  ('MySQL', 'Open-source relational database management system', 'MySQL is an open-source relational database management system. Its name is a combination of "My", the name of co-founder Michael Widenius\'s daughter, and "SQL", the abbreviation for Structured Query Language.', 'database', '8.0.31', '/placeholder.svg?height=80&width=80', 'Linux server with at least 1GB RAM', false),
  
  ('WordPress', 'Content management system for websites and blogs', 'WordPress is a free and open-source content management system written in PHP and paired with a MySQL or MariaDB database. Features include a plugin architecture and a template system, referred to within WordPress as Themes.', 'cms', '6.1.1', '/placeholder.svg?height=80&width=80', 'Linux server with at least 1GB RAM, PHP 7.4+, MySQL/MariaDB', true);

