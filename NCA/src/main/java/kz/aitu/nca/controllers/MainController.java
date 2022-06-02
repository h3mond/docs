package kz.aitu.nca.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

  @GetMapping("/main")
  String main() {
    return "Hello, word";
  }

}
