package com.maint_up.backend.controller;

import com.maint_up.backend.model.Ubicacion;
import com.maint_up.backend.repository.UbicacionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ubicaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class UbicacionController {

    private final UbicacionRepository ubicacionRepository;

    public UbicacionController(UbicacionRepository ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    @GetMapping
    public List<Ubicacion> obtenerTodos() {
        return ubicacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public Ubicacion obtenerPorId(@PathVariable Long id) {
        return ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
    }

    @PostMapping
    public Ubicacion crear(@RequestBody Ubicacion ubicacion) {
        if (ubicacion.getNombre() == null || ubicacion.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        return ubicacionRepository.save(ubicacion);
    }

    @PutMapping("/{id}")
    public Ubicacion actualizar(@PathVariable Long id, @RequestBody Ubicacion ubicacion) {
        Ubicacion existente = ubicacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
        
        if (ubicacion.getNombre() != null) {
            existente.setNombre(ubicacion.getNombre());
        }
        
        return ubicacionRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ubicacionRepository.deleteById(id);
    }
}
