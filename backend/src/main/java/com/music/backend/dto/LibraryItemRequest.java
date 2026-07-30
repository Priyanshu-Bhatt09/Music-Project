package com.music.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record LibraryItemRequest(
    @NotNull Long appleCatalogId,
    @NotBlank String title,
    @NotBlank String artistName,
    @NotBlank String genre,
    LocalDate releaseDate,
    Integer trackCount,
    Integer durationSeconds,
    String artworkUrl,
    @Min(1) @Max(5) Integer userRating,
    String userNotes
) {}
