package com.maint_up.backend.controller;

import com.maint_up.backend.model.TipoEquipo;
import com.maint_up.backend.repository.TipoEquipoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-equipo")
@CrossOrigin(origins = "http://localhost:5173")
public class TipoEquipoController {

    private final TipoEquipoRepository tipoEquipoRepository;

    public TipoEquipoController(TipoEquipoRepository tipoEquipoRepository) {
        this.tipoEquipoRepository = tipoEquipoRepository;
    }

    @GetMapping
    public List<TipoEquipo> obtenerTodos() {
        return tipoEquipoRepository.findAll();
    }

    @GetMapping("/{id}")
    public TipoEquipo obtenerPorId(@PathVariable Long id) {
        return tipoEquipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TipoEquipo no encontrado"));
    }

    @PostMapping
    public TipoEquipo crear(@RequestBody TipoEquipo tipoEquipo) {
        if (tipoEquipo.getNombre() == null || tipoEquipo.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        return tipoEquipoRepository.save(tipoEquipo);
    }

    @PutMapping("/{id}")
    public TipoEquipo actualizar(@PathVariable Long id, @RequestBody TipoEquipo tipoEquipo) {
        TipoEquipo existente = tipoEquipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TipoEquipo no encontrado"));
        
        if (tipoEquipo.getNombre() != null) {
            existente.setNombre(tipoEquipo.getNombre());
        }
        if (tipoEquipo.getDescripcion() != null) {
            existente.setDescripcion(tipoEquipo.getDescripcion());
        }
        
        return tipoEquipoRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        tipoEquipoRepository.deleteById(id);
    }
}
