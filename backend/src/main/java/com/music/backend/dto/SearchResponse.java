package com.music.backend.dto;

import java.util.List;

public record SearchResponse(int resultCount, List<SearchResultResponse> results) {}
