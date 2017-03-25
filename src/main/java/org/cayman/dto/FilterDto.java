package org.cayman.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterDto {
    private int from;
    private int to;
    private String lang;
    private int categoryId;
}
