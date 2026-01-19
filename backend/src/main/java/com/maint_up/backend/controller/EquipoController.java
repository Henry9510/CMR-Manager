package com.maint_up.backend.controller;

import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.service.EquipoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "http://localhost:5173/") // para frontend
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    // GET - listar equipos
    @GetMapping
    public List<Equipo> listar() {
        return equipoService.obtenerTodos();
    }

    // GET - equipo por ID
    @GetMapping("/{id}")
    public Equipo obtener(@PathVariable Long id) {
        return equipoService.obtenerPorId(id);
    }

    // POST - crear equipo
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Equipo equipo) {
        try {
            Equipo nuevoEquipo = equipoService.crearEquipo(equipo);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEquipo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // PUT - actualizar equipo
    @PutMapping("/{id}")
    public ResponseEntity<Equipo> actualizar(
            @PathVariable Long id,
            @RequestBody Equipo equipo) {
        return ResponseEntity.ok(equipoService.actualizarEquipo(id, equipo));
    }

    // DELETE - eliminar equipo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        equipoService.eliminarEquipo(id);
        return ResponseEntity.noContent().build();
    }
}
