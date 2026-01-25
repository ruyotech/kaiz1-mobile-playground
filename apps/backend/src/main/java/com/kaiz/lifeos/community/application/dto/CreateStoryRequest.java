package com.kaiz.lifeos.community.application.dto;

import com.kaiz.lifeos.community.domain.StoryCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Request DTO for creating a success story. */
public record CreateStoryRequest(
        @NotBlank(message = "Title is required")
                @Size(max = 200, message = "Title must be at most 200 characters")
                String title,
        @NotBlank(message = "Story is required") String story,
        StoryCategory category,
        String lifeWheelAreaId,
        List<String> imageUrls) {}
