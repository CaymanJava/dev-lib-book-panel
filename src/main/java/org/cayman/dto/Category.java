package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    public Category(int id, String name) {
        this.id = id;
        this.name = name;
    }

    private int id;
    private String name;
    private String image;
}
