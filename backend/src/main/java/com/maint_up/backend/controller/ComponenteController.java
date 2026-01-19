package com.maint_up.backend.controller;

import com.maint_up.backend.model.Componente;
import com.maint_up.backend.service.ComponenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/componentes")
@CrossOrigin(origins = "http://localhost:5173/")
public class ComponenteController {

    private final ComponenteService componenteService;

    public ComponenteController(ComponenteService componenteService) {
        this.componenteService = componenteService;
    }

    // GET: Obtener todos los componentes
    @GetMapping
    public ResponseEntity<List<Componente>> obtenerTodos() {
        List<Componente> componentes = componenteService.obtenerTodos();
        return ResponseEntity.ok(componentes);
    }

    // GET: Obtener componentes por equipo
    @GetMapping("/por-equipo/{equipoId}")
    public ResponseEntity<List<Componente>> obtenerPorEquipo(@PathVariable Long equipoId) {
        try {
            List<Componente> componentes = componenteService.obtenerPorEquipo(equipoId);
            return ResponseEntity.ok(componentes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // GET: Obtener componente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Componente> obtenerPorId(@PathVariable Long id) {
        try {
            Componente componente = componenteService.obtenerPorId(id);
            return ResponseEntity.ok(componente);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // POST: Crear nuevo componente
    @PostMapping
    public ResponseEntity<?> crearComponente(@RequestBody Componente componente) {
        try {
            Componente nuevoComponente = componenteService.crearComponente(componente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoComponente);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // DELETE: Eliminar componente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarComponente(@PathVariable Long id) {
        try {
            componenteService.eliminarComponente(id);
            return ResponseEntity.ok("Componente eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
