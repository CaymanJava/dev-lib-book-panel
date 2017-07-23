package org.cayman.web.controllers;

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

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Locale;

@Controller
@Slf4j
public class CommonController {
    private final AuthorService authorService;
    private final BookService bookService;
    private final CategoryService categoryService;
    private final PublisherService publisherService;
    private final UserService userService;
    private final CustomSecurityService securityService;
    private final MessageSource messageSource;
    private final ContactService contactService;

    @Autowired
    public CommonController(AuthorService authorService, BookService bookService,
                            CategoryService categoryService, PublisherService publisherService,
                            UserService userService, CustomSecurityService securityService,
                            MessageSource messageSource, ContactService contactService) {
        this.authorService = authorService;
        this.bookService = bookService;
        this.categoryService = categoryService;
        this.publisherService = publisherService;
        this.userService = userService;
        this.securityService = securityService;
        this.messageSource = messageSource;
        this.contactService = contactService;
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
        addUserCredAndCategoriesToModel(model);
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
        addUserCredAndCategoriesToModel(model);
        return "user";
    }

    @RequestMapping(value = "user", method = RequestMethod.POST)
    public @ResponseBody boolean editUser(@RequestParam("id") int id,
                                          @RequestParam("email") String email,
                                          @RequestParam("old_password") String oldPassword,
                                          @RequestParam("new_password") String newPassword) {
        if (!LoggedUser.get().checkPassword(oldPassword)) return false;
        User user = userService.getById(id);
        user.setEmail(email);
        user.setPassword(newPassword);
        userService.update(user);
        return true;
    }

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String startPage(Model model) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("bookList", bookService.getLastTwelveBooks());
        return "index";
    }

    @RequestMapping(value = "about", method = RequestMethod.GET)
    public String about(Model model) {
        addUserCredAndCategoriesToModel(model);
        return "about";
    }

    @RequestMapping(value = "author", method = RequestMethod.GET)
    public String author(Model model, @RequestParam("id") int id) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("bookListDto", bookService.getAllByAuthorId(id));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", authorService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "authors", method = RequestMethod.GET)
    public String authors(Model model) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("authorList", authorService.getAllAuthors());
        return "authors";
    }

    @RequestMapping(value = "contact", method = RequestMethod.GET)
    public String contact(Model model) {
        addUserCredAndCategoriesToModel(model);
        return "contact";
    }

    @RequestMapping(value="contact", method = RequestMethod.POST)
    public @ResponseBody Boolean sendMessage(@RequestParam("email") String email,
                                             @RequestParam("message") String message,
                                             @RequestParam("recaptcha") String recaptcha,
                                             HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        log.info("Receive message: " + message + " and email: " + email + " from ip: " + ip);
        return contactService.sendMessage(email, message, ip, recaptcha);
    }

    @RequestMapping(value = "category", method = RequestMethod.GET)
    public String category(Model model, @RequestParam("id") int id) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("bookListDto", bookService.getAllBooksByCategoryId(id));
        model.addAttribute("categoryId", id);
        model.addAttribute("title", categoryService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "publisher", method = RequestMethod.GET)
    public String publisher(Model model, @RequestParam("id") int id) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("categoryList", categoryService.getAllCategories());
        model.addAttribute("bookListDto", bookService.getAllBooksByPublisherId(id));
        model.addAttribute("categoryId", 0);
        model.addAttribute("title", publisherService.getById(id).getName());
        return "books";
    }

    @RequestMapping(value = "publishers", method = RequestMethod.GET)
    public String publishers(Model model) {
        addUserCredAndCategoriesToModel(model);
        model.addAttribute("publisherList", publisherService.getAllPublishers());
        return "publishers";
    }

    @RequestMapping(value = "search", method = RequestMethod.POST)
    public String search(Model model,  Locale locale, @RequestParam("keyword") String keyword) {
        addUserCredAndCategoriesToModel(model);
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
        addUserCredAndCategoriesToModel(model);
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
        addUserCredAndCategoriesToModel(model);
        Book book = bookService.getBookById(id);
        model.addAttribute("book", book);
        model.addAttribute("lastBooks", bookService.getLastFourBooksInCategory(book.getCategory().getId(), id));
        return "book";
    }

    private void addUserCredAndCategoriesToModel(Model model) {
        addCategoriesInModel(model);
        LoggedUser loggedUser = LoggedUser.get();
        if (loggedUser != null) {
            model.addAttribute("email", loggedUser.getUsername());
            model.addAttribute("userId", LoggedUser.id());
        } else {
            model.addAttribute("email", "");
            model.addAttribute("userId", 0);
        }
    }

    private void addCategoriesInModel(Model model) {
        model.addAttribute("categoryList", categoryService.getAllCategories());
    }
}
