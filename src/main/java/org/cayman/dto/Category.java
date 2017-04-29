package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category implements Comparable {
    public Category(int id, String name) {
        this.id = id;
        this.name = name;
    }

    private int id;
    private String name;
    private String image;

    @Override
    public int compareTo(Object o) {
        return this.getName().compareTo(((Category) o).getName());
    }
}
