ALTER TABLE company_profiles
ADD COLUMN cv_delivery_terms BOOLEAN DEFAULT false,
ADD COLUMN job_posting_terms BOOLEAN DEFAULT false;