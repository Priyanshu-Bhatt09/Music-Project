package com.music.backend.controller;

import com.music.backend.dto.SearchResponse;
import com.music.backend.service.ItunesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {
  private final ItunesService itunesService;

  public SearchController(ItunesService itunesService) {
    this.itunesService = itunesService;
  }

  @GetMapping
  public SearchResponse search(@RequestParam String query, @RequestParam(defaultValue = "albums") String type) {
    return itunesService.search(query, type);
  }
}
