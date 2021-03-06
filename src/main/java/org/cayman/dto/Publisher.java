package org.cayman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Publisher implements Comparable<Publisher>{
    private int id;
    private String name;

    @Override
    public int compareTo(Publisher o) {
        return this.getName().compareTo(o.getName());
    }
}
