package org.cayman.utils;


import org.cayman.dto.Book;
import org.cayman.dto.BookDto;

import java.util.ArrayList;
import java.util.List;

public class EntityConverter {
    public static List<BookDto> convertBookToBookDTO(String fileServiceUrl, Book... books) {
        List<BookDto> result = new ArrayList<>();
        for (Book book : books) {
            result.add(BookDto.builder()
                    .id(book.getId())
                    .name(book.getName())
                    .image(fileServiceUrl + book.getImage())
                    .fileId(book.getFileId())
                    .description(book.getDescription())
                    .categoryName(book.getCategory().getName())
                    .build()
            );
        }
        return result;
    }
}
