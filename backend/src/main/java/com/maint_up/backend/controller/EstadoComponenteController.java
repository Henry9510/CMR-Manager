package com.maint_up.backend.controller;

import com.maint_up.backend.model.EstadoComponente;
import com.maint_up.backend.repository.EstadoComponenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estado-componente")
@CrossOrigin(origins = "*")
public class EstadoComponenteController {

    @Autowired
    private EstadoComponenteRepository estadoComponenteRepository;

    @GetMapping
    public List<EstadoComponente> getAll() {
        return estadoComponenteRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<EstadoComponente> getById(@PathVariable Long id) {
        return estadoComponenteRepository.findById(id);
    }

    @PostMapping
    public EstadoComponente create(@RequestBody EstadoComponente estado) {
        return estadoComponenteRepository.save(estado);
    }

    @PutMapping("/{id}")
    public EstadoComponente update(@PathVariable Long id, @RequestBody EstadoComponente estadoDetails) {
        return estadoComponenteRepository.findById(id).map(estado -> {
            estado.setNombre(estadoDetails.getNombre());
            estado.setDescripcion(estadoDetails.getDescripcion());
            return estadoComponenteRepository.save(estado);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        estadoComponenteRepository.deleteById(id);
    }
}
