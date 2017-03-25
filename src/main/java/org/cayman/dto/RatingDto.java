package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDto {
    private int userId;
    private int bookId;
    private int ratingId;
    private int value;
}
