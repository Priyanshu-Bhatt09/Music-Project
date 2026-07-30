package com.music.backend.controller;

import com.music.backend.dto.InsightResponse;
import com.music.backend.service.InsightService;
import com.music.backend.service.LibraryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
  private final InsightService insightService;
  private final LibraryService libraryService;

  public InsightController(InsightService insightService, LibraryService libraryService) {
    this.insightService = insightService;
    this.libraryService = libraryService;
  }

  @GetMapping("/summary")
  public InsightResponse summary() {
    return insightService.summarize(libraryService.findAll(PageRequest.of(0, 1000)).getContent());
  }
}
