package com.music.backend.dto;

import java.time.LocalDate;

public record SearchResultResponse(
    Long appleCatalogId,
    String title,
    String artistName,
    String genre,
    LocalDate releaseDate,
    Integer trackCount,
    Integer durationSeconds,
    String artworkUrl
) {}
