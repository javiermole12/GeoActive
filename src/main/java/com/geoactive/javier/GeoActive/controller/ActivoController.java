package com.geoactive.javier.GeoActive.controller;

import com.geoactive.javier.GeoActive.model.Activo;
import com.geoactive.javier.GeoActive.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activos")
public class ActivoController {

    @Autowired
    private FirestoreService firestoreService;

    @PostMapping
    public ResponseEntity<Void> crearActivo(@RequestBody Activo activo) throws Exception {
        firestoreService.guardarActivo(activo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Activo> obtenerActivos() throws Exception {
        return firestoreService.obtenerActivos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerActivoPorId(@PathVariable String id) throws Exception {
        Map<String, Object> resultado = firestoreService.obtenerActivoPorId(id);
        if (resultado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarActivo(@PathVariable String id) throws Exception {
        firestoreService.borrarActivo(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/revisiones")
    public ResponseEntity<Map<String, Object>> registrarRevision(@PathVariable String id, @RequestBody Map<String, String> body) {
        String revisadoPor = body.get("revisadoPor");
        if (revisadoPor == null || revisadoPor.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Map<String, Object> resultado = firestoreService.registrarRevision(id, revisadoPor);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
