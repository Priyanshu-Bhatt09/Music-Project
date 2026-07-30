package com.music.backend.dto;

import java.util.List;

public record InsightResponse(String summary, List<String> highlights, List<String> recommendations) {}
