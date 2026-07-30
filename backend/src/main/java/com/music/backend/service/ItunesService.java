package com.music.backend.service;

import com.music.backend.dto.SearchResponse;
import com.music.backend.dto.SearchResultResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ItunesService {
  private final RestClient restClient = RestClient.create("https://itunes.apple.com");
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Cacheable(cacheNames = "itunesSearch", key = "#query + ':' + #type")
  public SearchResponse search(String query, String type) {
    var responseBody = restClient.get()
        .uri(uriBuilder -> uriBuilder.path("/search")
            .queryParam("term", query)
            .queryParam("entity", mapEntity(type))
            .queryParam("limit", 24)
            .queryParam("media", "music")
            .build())
        .retrieve()
        .body(String.class);

    if (responseBody == null || responseBody.isBlank()) {
      return new SearchResponse(0, List.of());
    }

    try {
      return objectMapper.readValue(responseBody, ItunesSearchApiResponse.class).toResponse();
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to parse iTunes response", ex);
    }
  }

  private String mapEntity(String type) {
    return switch (type == null ? "albums" : type.toLowerCase()) {
      case "songs" -> "song";
      case "artists" -> "musicArtist";
      default -> "album";
    };
  }

  @JsonIgnoreProperties(ignoreUnknown = true)
  private record ItunesSearchApiResponse(int resultCount, List<RawItem> results) {
    SearchResponse toResponse() {
      List<SearchResultResponse> items = results == null
          ? List.of()
          : results.stream().map(RawItem::toDto).toList();
      return new SearchResponse(resultCount, items);
    }
  }

  @JsonIgnoreProperties(ignoreUnknown = true)
  private record RawItem(
      Long collectionId,
      Long trackId,
      String collectionName,
      String trackName,
      String artistName,
      String primaryGenreName,
      String releaseDate,
      Integer trackCount,
      Integer trackTimeMillis,
      String artworkUrl100
  ) {
    SearchResultResponse toDto() {
      var title = collectionName != null ? collectionName : trackName;
      return new SearchResultResponse(
          collectionId != null ? collectionId : trackId,
          title,
          artistName,
          primaryGenreName,
          releaseDate == null ? null : LocalDate.parse(releaseDate.substring(0, 10)),
          trackCount,
          trackTimeMillis == null ? null : trackTimeMillis / 1000,
          artworkUrl100
      );
    }
  }
}
