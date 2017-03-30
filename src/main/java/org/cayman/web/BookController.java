package org.cayman.web;

import lombok.extern.slf4j.Slf4j;
import org.cayman.dto.Book;
import org.cayman.dto.Rating;
import org.cayman.model.Role;
import org.cayman.model.User;
import org.cayman.service.*;
import org.cayman.utils.LoggedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.Locale;
//TODO refactoring!!!!
@Controller
@Slf4j
public class BookController {
    private final AuthorService authorService;
    private final BookService bookService;
    private final CategoryService categoryService;
    private final PublisherService publisherService;
    private final UserService userService;
    private final CustomSecurityService securityService;
    private final MessageSource messageSource;

    @Autowired
    public BookController(AuthorService authorService, BookService bookService,
                          CategoryService categoryService, PublisherService publisherService,
                          UserService userService, CustomSecurityService securityService,
                          MessageSource messageSource) {
        this.authorService = authorService;
        this.bookService = bookService;
        this.categoryService = categoryService;
        this.publisherService = publisherService;
        this.userService = userService;
        this.securityService = securityService;
        this.messageSource = messageSource;
    }


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String root(){
        return "redirect:/index";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(ModelMap model,
                        @RequestParam(value = "error", required = false) boolean error,
                        @RequestParam(value = "message", required = false) String message) {
        model.put("error", error);
        model.put("message", message);
        return "redirect:/index";
    }

    @RequestMapping(value="auth", method = RequestMethod.GET)
    public String auth(Model model) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        return "auth";
    }

    @RequestMapping(value="registration", method = RequestMethod.POST)
    public @ResponseBody Boolean registration(@RequestParam("email") String email,
                         @RequestParam("password") String password) {
        if (userService.getByEmail(email) != null) return false;
        userService.save(User.builder()
                            .email(email)
                            .password(password)
                            .enabled(true)
                            .registered(LocalDateTime.now())
                            .role(Role.USER)
                            .build());
        securityService.autologin(email, password);
        return true;
    }

    @RequestMapping(value = "user", method = RequestMethod.GET)
    public String userInfo(Model model) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        return "user";
    }

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String startPage(Model model) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookList", bookService.getLastTwelveBooks());
        return "index";
    }

    @RequestMapping(value = "about", method = RequestMethod.GET)
    public String about(Model model) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        return "about";
    }

    @RequestMapping(value = "contact", method = RequestMethod.GET)
    public String contact(Model model) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        return "contact";
    }

    @RequestMapping(value="contact", method = RequestMethod.POST)
    public @ResponseBody Boolean sendMessage(@RequestParam("email") String email,
                                              @RequestParam("message") String message) {
        //TODO
        log.info("Email: " + email);
        log.info("Message: " + message);
        return true;
    }

    @RequestMapping(value = "category", method = RequestMethod.GET)
    public String category(Model model, @RequestParam("id") int id) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.getAllBooksByCategoryId(id));
        model.addAttribute("categoryId", id);
        model.addAttribute("title", categoryService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "publisher", method = RequestMethod.GET)
    public String publisher(Model model, @RequestParam("id") int id) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.getAllBooksByPublisherId(id));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", publisherService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "author", method = RequestMethod.GET)
    public String author(Model model, @RequestParam("id") int id) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.getAllByAuthorId(id));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", authorService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "search", method = RequestMethod.POST)
    public String search(Model model,  Locale locale, @RequestParam("keyword") String keyword) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.search(keyword));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", messageSource.getMessage("search.result", null, locale) + ": \""  + keyword + "\"");
        return "books";
    }

    @RequestMapping(value = "filter", method = RequestMethod.POST)
    public String filter(Model model, Locale locale,
                         @RequestParam("language") String lang,
                         @RequestParam("category") int categoryId,
                         @RequestParam("from_year") int fromYear,
                         @RequestParam("to_year") int toYear) {
        addUserCredToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.filter(lang, categoryId, fromYear, toYear));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", messageSource.getMessage("filter.title", null, locale));
        return "books";
    }

    @RequestMapping(value = "vote", method = RequestMethod.GET)
    public @ResponseBody Rating vote(@RequestParam("userId") int userId,
                                     @RequestParam("bookId") int bookId,
                                     @RequestParam("ratingId") int ratingId,
                                     @RequestParam("value") int value) {
        return bookService.vote(userId, bookId, ratingId, value);
    }

    @RequestMapping(value = "book", method = RequestMethod.GET)
    public String getBook(Model model, @RequestParam("id") int id) {
        addUserCredToModel(model);
        Book book = bookService.getBookById(id);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("book", book);
        model.addAttribute("lastBooks", bookService.getLastFourBooksInCategory(book.getCategory().getId(), id));
        return "book";
    }

    private void addUserCredToModel(Model model) {
        LoggedUser loggedUser = LoggedUser.get();
        if (loggedUser != null) {
            model.addAttribute("email", loggedUser.getUsername());
            model.addAttribute("userId", LoggedUser.id());
        } else {
            model.addAttribute("email", "");
            model.addAttribute("userId", 0);
        }
    }
}
