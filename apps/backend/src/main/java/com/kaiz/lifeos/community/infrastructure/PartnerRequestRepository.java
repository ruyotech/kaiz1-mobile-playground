package com.kaiz.lifeos.community.infrastructure;

import com.kaiz.lifeos.community.domain.PartnerRequest;
import com.kaiz.lifeos.community.domain.PartnerRequestStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Repository for PartnerRequest entity. */
@Repository
public interface PartnerRequestRepository extends JpaRepository<PartnerRequest, UUID> {

    List<PartnerRequest> findByToMemberIdAndStatus(UUID toMemberId, PartnerRequestStatus status);

    List<PartnerRequest> findByFromMemberId(UUID fromMemberId);

    List<PartnerRequest> findByToMemberId(UUID toMemberId);
}
