package com.geoactive.javier.GeoActive.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    //@GetMapping("/activos/{id}")
    //public String mostrarVistaActivo() {
    //    return "detalle-activo"; // Busca `detalle.html` en `src/main/resources/templates` si usas Thymeleaf,
        // o en `src/main/resources/static` si es HTML puro.
    //}

    @GetMapping("/activos/{id}")
    public String verActivo() {
        return "forward:/detalle.html";
    }


    //@GetMapping("/")
    //public String mostrarInicio() {
    //    return "index"; // Para que al ir a `/` también sirva `index.html`
    //}

    @GetMapping("/")
    public String redirigirALogin() {
        return "redirect:/login.html";
    }
}
