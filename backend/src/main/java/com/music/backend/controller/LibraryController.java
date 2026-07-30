package com.music.backend.controller;

import com.music.backend.dto.LibraryItemRequest;
import com.music.backend.dto.LibraryItemResponse;
import com.music.backend.entity.LibraryItem;
import com.music.backend.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
  private final LibraryService service;

  public LibraryController(LibraryService service) {
    this.service = service;
  }

  @GetMapping
  public Page<LibraryItemResponse> all(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return service.findAll(PageRequest.of(page, size)).map(this::toResponse);
  }

  @PostMapping
  public LibraryItemResponse create(@Valid @RequestBody LibraryItemRequest request) {
    return toResponse(service.create(request));
  }

  @PutMapping("/{id}")
  public LibraryItemResponse update(@PathVariable Long id, @Valid @RequestBody LibraryItemRequest request) {
    return toResponse(service.update(id, request));
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }

  private LibraryItemResponse toResponse(LibraryItem item) {
    return new LibraryItemResponse(
        item.getId(),
        item.getAppleCatalogId(),
        item.getTitle(),
        item.getArtistName(),
        item.getGenre(),
        item.getReleaseDate(),
        item.getTrackCount(),
        item.getDurationSeconds(),
        item.getArtworkUrl(),
        item.getUserRating(),
        item.getUserNotes(),
        item.getCreatedAt(),
        item.getUpdatedAt()
    );
  }
}
