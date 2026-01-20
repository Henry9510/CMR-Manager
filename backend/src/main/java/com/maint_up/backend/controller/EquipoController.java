package com.maint_up.backend.controller;

import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.service.EquipoService;
import com.maint_up.backend.dto.EquipoDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "http://localhost:5173")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    // GET - listar todos los equipos
    @GetMapping
    public ResponseEntity<List<Equipo>> listar() {
        return ResponseEntity.ok(equipoService.obtenerTodos());
    }

    // GET - equipo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Equipo> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.obtenerPorId(id));
    }

    // POST - crear equipo
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EquipoDTO equipoDTO) {
        try {
            Equipo nuevoEquipo = equipoService.crearEquipo(equipoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEquipo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - actualizar equipo
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody EquipoDTO equipoDTO) {
        try {
            Equipo actualizado = equipoService.actualizarEquipo(id, equipoDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE - eliminar equipo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        equipoService.eliminarEquipo(id);
        return ResponseEntity.noContent().build();
    }
}
