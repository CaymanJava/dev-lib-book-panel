package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Author implements Comparable<Author>{
    private int id;
    private String name;

    @Override
    public int compareTo(Author o) {
        return this.getName().compareTo(o.getName());
    }
}
