package com.maint_up.backend.controller;

import com.maint_up.backend.model.Criticidad;
import com.maint_up.backend.repository.CriticidadRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/criticidades")
@CrossOrigin(origins = "http://localhost:5173")
public class CriticidadController {

    private final CriticidadRepository criticidadRepository;

    public CriticidadController(CriticidadRepository criticidadRepository) {
        this.criticidadRepository = criticidadRepository;
    }

    @GetMapping
    public List<Criticidad> obtenerTodos() {
        return criticidadRepository.findAll();
    }

    @GetMapping("/{id}")
    public Criticidad obtenerPorId(@PathVariable Long id) {
        return criticidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Criticidad no encontrada"));
    }

    @PostMapping
    public Criticidad crear(@RequestBody Criticidad criticidad) {
        if (criticidad.getNivel() == null || criticidad.getNivel().isEmpty()) {
            throw new IllegalArgumentException("El nivel es requerido");
        }
        return criticidadRepository.save(criticidad);
    }

    @PutMapping("/{id}")
    public Criticidad actualizar(@PathVariable Long id, @RequestBody Criticidad criticidad) {
        Criticidad existente = criticidadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Criticidad no encontrada"));
        
        if (criticidad.getNivel() != null) {
            existente.setNivel(criticidad.getNivel());
        }
        
        return criticidadRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        criticidadRepository.deleteById(id);
    }
}
