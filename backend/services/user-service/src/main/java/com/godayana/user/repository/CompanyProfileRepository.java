package com.godayana.user.repository;

import com.godayana.user.entity.CompanyProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID> {
    Optional<CompanyProfile> findByUserId(UUID userId);

    Optional<CompanyProfile> findByCompanyNameIgnoreCase(String companyName);

    Page<CompanyProfile> findByStatus(CompanyProfile.CompanyStatus status, Pageable pageable);

    List<CompanyProfile> findByIsVerifiedFalse();

    boolean existsByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CompanyProfile c WHERE c.userId = :userId")
    void deleteByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE CompanyProfile c SET c.status = :status WHERE c.userId = :userId")
    void updateStatusByUserId(UUID userId, CompanyProfile.CompanyStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE CompanyProfile c SET c.isVerified = :verified WHERE c.userId = :userId")
    void updateVerificationStatus(UUID userId, Boolean verified);
}