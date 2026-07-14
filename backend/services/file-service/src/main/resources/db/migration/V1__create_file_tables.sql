-- V1__create_file_tables.sql
-- Create uploaded_files table for tracking file uploads

CREATE TABLE IF NOT EXISTS uploaded_files (
    id VARCHAR(36) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    folder VARCHAR(100) NOT NULL,
    file_key VARCHAR(500) NOT NULL UNIQUE,
    uploader_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    uploaded_at TIMESTAMP,
    deleted_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_uploaded_files_uploader_id ON uploaded_files(uploader_id);
CREATE INDEX idx_uploaded_files_status ON uploaded_files(status);
CREATE INDEX idx_uploaded_files_created_at ON uploaded_files(created_at DESC);
CREATE INDEX idx_uploaded_files_folder ON uploaded_files(folder);
CREATE INDEX idx_uploaded_files_uploader_status ON uploaded_files(uploader_id, status);