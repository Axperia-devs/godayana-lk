CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';

-- User should already be created by POSTGRES_USER env variable
-- But if you need to ensure it exists:
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'godayana') THEN
        -- Password will be replaced by Railway's environment variable
        CREATE USER godayana WITH PASSWORD '${POSTGRES_PASSWORD}';
    END IF;
END
$$;

-- Grant privileges (use IF EXISTS to avoid errors)
GRANT ALL PRIVILEGES ON DATABASE auth_db TO godayana;

-- Set schema search path
ALTER DATABASE auth_db SET search_path TO public, auth;