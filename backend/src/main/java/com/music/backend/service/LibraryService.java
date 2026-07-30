package com.music.backend.service;

import com.music.backend.dto.LibraryItemRequest;
import com.music.backend.entity.LibraryItem;
import com.music.backend.exception.ApiException;
import com.music.backend.repository.LibraryItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class LibraryService {
  private final LibraryItemRepository repository;

  public LibraryService(LibraryItemRepository repository) {
    this.repository = repository;
  }

  public Page<LibraryItem> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public LibraryItem create(LibraryItemRequest request) {
    repository.findByAppleCatalogId(request.appleCatalogId()).ifPresent(item -> {
      throw new ApiException(HttpStatus.CONFLICT, "Library item already exists");
    });
    var item = new LibraryItem();
    apply(item, request);
    return repository.save(item);
  }

  public LibraryItem update(Long id, LibraryItemRequest request) {
    var item = repository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Library item not found"));
    repository.findByAppleCatalogId(request.appleCatalogId())
        .filter(existing -> !existing.getId().equals(id))
        .ifPresent(existing -> {
          throw new ApiException(HttpStatus.CONFLICT, "Library item already exists");
        });
    apply(item, request);
    return repository.save(item);
  }

  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Library item not found");
    }
    repository.deleteById(id);
  }

  private void apply(LibraryItem item, LibraryItemRequest request) {
    item.setAppleCatalogId(request.appleCatalogId());
    item.setTitle(request.title());
    item.setArtistName(request.artistName());
    item.setGenre(request.genre());
    item.setReleaseDate(request.releaseDate());
    item.setTrackCount(request.trackCount());
    item.setDurationSeconds(request.durationSeconds());
    item.setArtworkUrl(request.artworkUrl());
    item.setUserRating(request.userRating());
    item.setUserNotes(request.userNotes());
  }
}
