package org.cayman.service;

import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.*;
import org.cayman.utils.Constants;
import org.cayman.utils.EntityConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Controller
@Slf4j
public class BookService {
    private final Constants constants;
    private final RestTemplate restTemplate;

    @Autowired
    public BookService(Constants constants, RestTemplate restTemplate) {
        this.constants = constants;
        this.restTemplate = restTemplate;
    }

    public List<Book> getAllBooks(){
        String url = constants.getBookServiceUrl() + "/book";
        return Arrays.asList(restTemplate.getForObject(url, Book[].class));
    }

    public List<BookDto> getLastTwelveBooks() {
        String url = constants.getBookServiceUrl() + "/book/some?count=12";
        return EntityConverter.convertBookToBookDTO(constants.getFileServiceUrl(), restTemplate.getForObject(url, Book[].class));
    }

    public BookListDto getAllBooksByCategoryId(int id) {
        String url = constants.getBookServiceUrl() + "/book/category?id={id}";
        Book[] books = restTemplate.getForObject(url, Book[].class, id);
        return convertImageUrlAndSplitOnChunks(books);
    }

    public BookListDto getAllBooksByPublisherId(int id) {
        String url = constants.getBookServiceUrl() + "/book/publisher?id={id}";
        Book[] books = restTemplate.getForObject(url, Book[].class, id);
        return convertImageUrlAndSplitOnChunks(books);
    }

    public BookListDto getAllByAuthorId(int id) {
        String url = constants.getBookServiceUrl() + "/book/author?id={id}";
        Book[] books = restTemplate.getForObject(url, Book[].class, id);
        return convertImageUrlAndSplitOnChunks(books);
    }

    public BookListDto search(String keyword) {
        String url = constants.getBookServiceUrl() + "/search";
        Book[] books = restTemplate.postForObject(url, new SearchDto(keyword), Book[].class);
        return convertImageUrlAndSplitOnChunks(books);
    }

    public BookListDto filter(String lang, int categoryId, int fromYear, int toYear) {
        String url = constants.getBookServiceUrl() + "/filter";
        Book[] books = restTemplate.postForObject(url, new FilterDto(fromYear, toYear, lang, categoryId), Book[].class);
        return convertImageUrlAndSplitOnChunks(books);
    }

    public Rating vote(int userId, int bookId, int ratingId, int value) {
        String url = constants.getBookServiceUrl() + "/rating/save";
        return restTemplate.postForObject(url, new RatingDto(userId, bookId, ratingId, value), Rating.class);
    }

    private void addUrlToImages(Book ... books) {
        Arrays.stream(books).forEach(b -> b.setImage(constants.getFileServiceUrl() + b.getImage()));
    }


    private BookListDto convertImageUrlAndSplitOnChunks(Book ... books) {
        addUrlToImages(books);
        List<List<Book>> chunks = splitBooksOnChunks(books);
        return new BookListDto(books.length, chunks);
    }

    private List<List<Book>> splitBooksOnChunks(Book ... books) {
        List<List<Book>> result = new ArrayList<>();
        List<Book> tmp = new ArrayList<>();

        for (int i = 0; i < books.length; i++) {
            tmp.add(books[i]);
            if ((i + 1) % constants.getBooksInChunk() == 0 && (i + 1) / constants.getBooksInChunk() != 0) {
                result.add(tmp);
                tmp = new ArrayList<>();
            }
        }

        if (tmp.size() > 0) {
            result.add(tmp);
        }
        return result;
    }

    public Book getBookById(int id) {
        String url = constants.getBookServiceUrl() + "/book/one?id={id}";
        Book book = restTemplate.getForObject(url, Book.class, id);
        addUrlToImages(book);
        return book;
    }

    public List<BookDto> getLastFourBooksInCategory(int categoryId, int bookIdForRemove) {
        int lastBooksCount = constants.getLastBooksCount();
        String url = constants.getBookServiceUrl() + "/book/some/category?count={lastBooksCount}&id={categoryId}";
        List<BookDto> bookList =
                EntityConverter.convertBookToBookDTO(constants.getFileServiceUrl(), restTemplate.getForObject(url, Book[].class, lastBooksCount + 1, categoryId))
                        .stream()
                        .filter(b -> b.getId() != bookIdForRemove)
                        .collect(Collectors.toList());
        return bookList.size() > lastBooksCount ? bookList.subList(0, lastBooksCount) : bookList;
    }
}
