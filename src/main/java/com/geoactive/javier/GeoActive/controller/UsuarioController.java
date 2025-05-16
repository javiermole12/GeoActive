package com.geoactive.javier.GeoActive.controller;

import com.geoactive.javier.GeoActive.model.Usuario;
import com.geoactive.javier.GeoActive.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private FirestoreService firestoreService;

    @PostMapping("/registro")
    public ResponseEntity<Void> registrarUsuario(@RequestBody Usuario usuario) throws Exception {
        firestoreService.registrarUsuario(usuario);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> iniciarSesion(@RequestBody Usuario usuario) throws Exception {
        Usuario usuarioEncontrado = firestoreService.iniciarSesion(usuario.getEmail(), usuario.getPassword());
        if (usuarioEncontrado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuarioEncontrado);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> cerrarSesion() {
        firestoreService.cerrarSesion();
        return ResponseEntity.ok().build();
    }
} 