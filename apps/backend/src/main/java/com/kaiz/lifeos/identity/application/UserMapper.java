package com.kaiz.lifeos.identity.application;

import com.kaiz.lifeos.identity.application.dto.AuthDtos.UserResponse;
import com.kaiz.lifeos.identity.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "id", expression = "java(user.getId().toString())")
  @Mapping(target = "accountType", expression = "java(user.getAccountType().name())")
  @Mapping(target = "subscriptionTier", expression = "java(user.getSubscriptionTier().name())")
  UserResponse toUserResponse(User user);
}
