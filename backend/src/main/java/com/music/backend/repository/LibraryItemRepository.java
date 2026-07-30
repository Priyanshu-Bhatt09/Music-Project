package com.music.backend.repository;

import com.music.backend.entity.LibraryItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LibraryItemRepository extends JpaRepository<LibraryItem, Long>, JpaSpecificationExecutor<LibraryItem> {
  Optional<LibraryItem> findByAppleCatalogId(Long appleCatalogId);
}
