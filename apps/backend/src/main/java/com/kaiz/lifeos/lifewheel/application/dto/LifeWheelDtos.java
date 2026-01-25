package com.kaiz.lifeos.lifewheel.application.dto;

public sealed interface LifeWheelDtos {

  record LifeWheelAreaResponse(String id, String name, String icon, String color, int displayOrder)
      implements LifeWheelDtos {}

  record EisenhowerQuadrantResponse(
      String id, String name, String label, String description, String color, int displayOrder)
      implements LifeWheelDtos {}
}
