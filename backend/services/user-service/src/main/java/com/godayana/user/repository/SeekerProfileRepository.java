package com.godayana.user.repository;

import com.godayana.user.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, UUID> {
    Optional<SeekerProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM SeekerProfile s WHERE s.userId = :userId")
    void deleteByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE SeekerProfile s SET s.shareCv = :shareCv WHERE s.userId = :userId")
    void updateShareCvStatus(UUID userId, Boolean shareCv);
}