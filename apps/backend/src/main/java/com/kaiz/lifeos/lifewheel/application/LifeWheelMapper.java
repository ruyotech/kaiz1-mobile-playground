package com.kaiz.lifeos.lifewheel.application;

import com.kaiz.lifeos.lifewheel.application.dto.LifeWheelDtos.EisenhowerQuadrantResponse;
import com.kaiz.lifeos.lifewheel.application.dto.LifeWheelDtos.LifeWheelAreaResponse;
import com.kaiz.lifeos.lifewheel.domain.EisenhowerQuadrant;
import com.kaiz.lifeos.lifewheel.domain.LifeWheelArea;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LifeWheelMapper {

  LifeWheelAreaResponse toResponse(LifeWheelArea area);

  EisenhowerQuadrantResponse toResponse(EisenhowerQuadrant quadrant);
}
