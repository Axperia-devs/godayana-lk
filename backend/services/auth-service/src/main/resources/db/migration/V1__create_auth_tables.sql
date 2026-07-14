-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('SEEKER', 'COMPANY', 'ADMIN', 'DEV'))
);

-- Create indexes if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone') THEN
        CREATE INDEX idx_users_phone ON users(phone);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
END $$;

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_refresh_tokens_user') THEN
        ALTER TABLE refresh_tokens
        ADD CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Insert default DEV user
INSERT INTO users (id, email, phone, password_hash, role, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'dev@godayana.lk',
    '+94123456789',
    '$2a$12$NZXFWQ7oaIvLDs42E856M.WUVI3koKxPWElxwmiVJJ0nQ3utAW2IO', -- password: Dev@123
    'DEV',
    true
) ON CONFLICT (phone) DO NOTHING;

-- Insert default ADMIN user
INSERT INTO users (id, email, phone, password_hash, role, is_active)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'admin@godayana.lk',
    '+94771111111',
    '$2a$12$AHecDfmH2Cfdw9.gf7cHEee7Jp7Sc0UnGH4/O7sC6yXaYj6D2lOBa', -- password: Admin@123
    'ADMIN',
    true
) ON CONFLICT (phone) DO NOTHING;

-- Insert demo SEEKER user for testing
INSERT INTO users (id, email, phone, password_hash, role, is_active)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '',
    '+94000000000',
    '$2a$12$TfYbfVjSRLr4COaREMndN.5/7VF5AFcOaNiiTZwlCu9/wyECecQJG', -- password: Seeker@123
    'SEEKER',
    true
) ON CONFLICT (phone) DO NOTHING;

-- Insert demo COMPANY user for testing
INSERT INTO users (id, email, phone, password_hash, role, is_active)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    'company@godayana.lk',
    '+94773333333',
    '$2a$12$p6Qw7t9qImjbYdYVi7MvAeiVd5HWgp7RO/2k0IgIeBNgX1nAs9JRm', -- password: Company@123
    'COMPANY',
    true
) ON CONFLICT (phone) DO NOTHING;