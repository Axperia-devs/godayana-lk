CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'godayana') THEN
        CREATE USER godayana WITH PASSWORD COALESCE(current_setting('POSTGRES_PASSWORD', true));
    END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE auth_db TO godayana;