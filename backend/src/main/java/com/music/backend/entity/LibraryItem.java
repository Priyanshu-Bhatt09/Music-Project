package com.music.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "library_items", indexes = {
    @Index(name = "idx_library_items_apple_catalog_id", columnList = "apple_catalog_id", unique = true)
})
public class LibraryItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "apple_catalog_id", nullable = false, unique = true)
  private Long appleCatalogId;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String artistName;

  @Column(nullable = false)
  private String genre;

  private LocalDate releaseDate;

  private Integer trackCount;

  private Integer durationSeconds;

  private String artworkUrl;

  private Integer userRating;

  @Column(length = 2000)
  private String userNotes;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    var now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public Long getId() { return id; }
  public Long getAppleCatalogId() { return appleCatalogId; }
  public void setAppleCatalogId(Long appleCatalogId) { this.appleCatalogId = appleCatalogId; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getArtistName() { return artistName; }
  public void setArtistName(String artistName) { this.artistName = artistName; }
  public String getGenre() { return genre; }
  public void setGenre(String genre) { this.genre = genre; }
  public LocalDate getReleaseDate() { return releaseDate; }
  public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
  public Integer getTrackCount() { return trackCount; }
  public void setTrackCount(Integer trackCount) { this.trackCount = trackCount; }
  public Integer getDurationSeconds() { return durationSeconds; }
  public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
  public String getArtworkUrl() { return artworkUrl; }
  public void setArtworkUrl(String artworkUrl) { this.artworkUrl = artworkUrl; }
  public Integer getUserRating() { return userRating; }
  public void setUserRating(Integer userRating) { this.userRating = userRating; }
  public String getUserNotes() { return userNotes; }
  public void setUserNotes(String userNotes) { this.userNotes = userNotes; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
}
