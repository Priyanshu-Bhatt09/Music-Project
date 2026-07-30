package com.music.backend.service;

import com.music.backend.dto.InsightResponse;
import com.music.backend.entity.LibraryItem;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InsightService {
  public InsightResponse summarize(List<LibraryItem> items) {
    var total = items.size();
    var topGenre = items.stream()
        .map(LibraryItem::getGenre)
        .filter(g -> g != null && !g.isBlank())
        .findFirst()
        .orElse("Unknown");
    return new InsightResponse(
        "Your library has " + total + " saved items with an emerging taste around " + topGenre + ".",
        List.of("Library size: " + total, "Most visible genre: " + topGenre),
        List.of("Add more artists from the same genre to deepen the cluster.", "Try saving a few contrasting albums for discovery.")
    );
  }
}
