package com.kaiz.lifeos.notification.infrastructure;

import com.kaiz.lifeos.notification.domain.NotificationPreferences;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, UUID> {

  Optional<NotificationPreferences> findByUserId(UUID userId);

  boolean existsByUserId(UUID userId);
}
