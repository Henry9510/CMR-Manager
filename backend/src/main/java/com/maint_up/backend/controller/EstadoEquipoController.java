package com.maint_up.backend.controller;

import com.maint_up.backend.model.EstadoEquipo;
import com.maint_up.backend.repository.EstadoEquipoRepository;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
public class EstadoEquipoController {

    private final EstadoEquipoRepository estadoEquipoRepository;

    public EstadoEquipoController(EstadoEquipoRepository estadoEquipoRepository) {
        this.estadoEquipoRepository = estadoEquipoRepository;
    }

    @GetMapping
    public List<EstadoEquipo> obtenerTodos() {
        return estadoEquipoRepository.findAll();
    }

    @GetMapping("/{id}")
    public EstadoEquipo obtenerPorId(@PathVariable @NonNull Long id) {
        return estadoEquipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EstadoEquipo no encontrado"));
    }

    @PostMapping
    public EstadoEquipo crear(@RequestBody @NonNull EstadoEquipo estadoEquipo) {
        if (estadoEquipo.getNombre() == null || estadoEquipo.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        return estadoEquipoRepository.save(estadoEquipo);
    }

    @PutMapping("/{id}")
    public EstadoEquipo actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull EstadoEquipo estadoEquipo) {
        EstadoEquipo existente = estadoEquipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EstadoEquipo no encontrado"));
        
        if (estadoEquipo.getNombre() != null) {
            existente.setNombre(estadoEquipo.getNombre());
        }
        
        return estadoEquipoRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        estadoEquipoRepository.deleteById(id);
    }
}
