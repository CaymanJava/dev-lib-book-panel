package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookDto {
    private int id;
    private String name;
    private String image;
    private String description;
    private String fileId;
    private String categoryName;
}
