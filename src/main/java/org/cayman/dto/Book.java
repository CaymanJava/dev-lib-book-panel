package org.cayman.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    private int id;
    private String name;
    private String language;
    private int year;
    private List<Author> author;
    private Publisher publisher;
    private String image;
    private String fileId;
    private String description;
    private Category category;
    private int pageCount;
    private Rating rating;
    private int views;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime addDate;
}
