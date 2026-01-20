package com.maint_up.backend.controller;

import com.maint_up.backend.model.Componente;
import com.maint_up.backend.service.ComponenteService;
import com.maint_up.backend.dto.ComponenteDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
@CrossOrigin(origins = "http://localhost:5173")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    // GET: Obtener todos los componentes
    @GetMapping
    public ResponseEntity<List<Componente>> obtenerTodos() {
        return ResponseEntity.ok(componenteService.obtenerTodos());
    }

    // GET: Obtener componentes por equipo
    @GetMapping("/por-equipo/{equipoId}")
    public ResponseEntity<List<Componente>> obtenerPorEquipo(@PathVariable Long equipoId) {
        try {
            return ResponseEntity.ok(componenteService.obtenerPorEquipo(equipoId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: Obtener componente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Componente> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(componenteService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Crear nuevo componente
    @PostMapping
    public ResponseEntity<?> crearComponente(@RequestBody ComponenteDTO componenteDTO) {
        try {
            Componente nuevoComponente = componenteService.crearComponente(componenteDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoComponente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT: Actualizar componente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarComponente(@PathVariable Long id, @RequestBody ComponenteDTO componenteDTO) {
        try {
            Componente actualizado = componenteService.actualizarComponente(id, componenteDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE: Eliminar componente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComponente(@PathVariable Long id) {
        try {
            componenteService.eliminarComponente(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
