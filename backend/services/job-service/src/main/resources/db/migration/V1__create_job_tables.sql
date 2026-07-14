-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    location VARCHAR(200),
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_negotiable BOOLEAN DEFAULT false,
    education_level VARCHAR(100),
    min_experience VARCHAR(50),
    employment_type VARCHAR(50),
    field_of_study VARCHAR(200),
    min_age INTEGER,
    max_age INTEGER,
    job_description TEXT,
    working_hours VARCHAR(100),
    benefits TEXT,
    application_deadline TIMESTAMP,
    confirmation_email VARCHAR(255),
    type VARCHAR(20) DEFAULT 'local',
    skills TEXT[],
    description_image_url VARCHAR(500),
    cv_delivery_option VARCHAR(20) DEFAULT 'direct',
    matching_criteria TEXT,  -- Changed from JSONB to TEXT
    status VARCHAR(20) DEFAULT 'PENDING',
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMP,

    CONSTRAINT chk_job_type CHECK (type IN ('local', 'overseas')),
    CONSTRAINT chk_job_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CLOSED', 'DRAFT')),
    CONSTRAINT chk_cv_delivery_option CHECK (cv_delivery_option IN ('direct', 'matched'))
);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    seeker_id UUID NOT NULL,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    CONSTRAINT chk_application_status CHECK (status IN ('PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'))
);

-- ============================================
-- SAVED JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    seeker_id UUID NOT NULL,
    job_id UUID NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (seeker_id, job_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_cv_delivery_option ON jobs(cv_delivery_option);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON job_applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_job_applications_job'
                   AND table_name = 'job_applications') THEN
        ALTER TABLE job_applications
        ADD CONSTRAINT fk_job_applications_job
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_saved_jobs_job'
                   AND table_name = 'saved_jobs') THEN
        ALTER TABLE saved_jobs
        ADD CONSTRAINT fk_saved_jobs_job
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- TRIGGER FOR AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT JOB FOR TESTING (Optional)
-- ============================================
-- Insert a test job if needed (commented out by default)
-- INSERT INTO jobs (company_id, job_title, category, location, employment_type, job_description, confirmation_email, type, status)
-- VALUES (
--     '11111111-1111-1111-1111-111111111111',
--     'Test Job',
--     'IT',
--     'Colombo',
--     'full-time',
--     'This is a test job description',
--     'test@example.com',
--     'local',
--     'APPROVED'
-- );