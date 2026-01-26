package com.kaiz.lifeos.sensai.infrastructure;

import com.kaiz.lifeos.sensai.domain.SensAISettings;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for SensAISettings entities.
 */
@Repository
public interface SensAISettingsRepository extends JpaRepository<SensAISettings, UUID> {

    Optional<SensAISettings> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}
