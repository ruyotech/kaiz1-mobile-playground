package com.kaiz.lifeos.lifewheel.application;

import com.kaiz.lifeos.lifewheel.application.dto.LifeWheelDtos.EisenhowerQuadrantResponse;
import com.kaiz.lifeos.lifewheel.application.dto.LifeWheelDtos.LifeWheelAreaResponse;
import com.kaiz.lifeos.lifewheel.infrastructure.EisenhowerQuadrantRepository;
import com.kaiz.lifeos.lifewheel.infrastructure.LifeWheelAreaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LifeWheelService {

  private final LifeWheelAreaRepository lifeWheelAreaRepository;
  private final EisenhowerQuadrantRepository eisenhowerQuadrantRepository;
  private final LifeWheelMapper mapper;

  @Transactional(readOnly = true)
  @Cacheable("lifeWheelAreas")
  public List<LifeWheelAreaResponse> getAllLifeWheelAreas() {
    return lifeWheelAreaRepository.findAllOrderByDisplayOrder().stream()
        .map(mapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  @Cacheable("eisenhowerQuadrants")
  public List<EisenhowerQuadrantResponse> getAllEisenhowerQuadrants() {
    return eisenhowerQuadrantRepository.findAllOrderByDisplayOrder().stream()
        .map(mapper::toResponse)
        .toList();
  }
}
