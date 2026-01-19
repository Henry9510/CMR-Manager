package com.maint_up.backend.service;

import com.maint_up.backend.model.Componente;
import com.maint_up.backend.repository.ComponenteRepository;
import com.maint_up.backend.repository.EquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;
    private final EquipoRepository equipoRepository;

    public ComponenteService(ComponenteRepository componenteRepository, EquipoRepository equipoRepository) {
        this.componenteRepository = componenteRepository;
        this.equipoRepository = equipoRepository;
    }

    // Obtener todos los componentes
    public List<Componente> obtenerTodos() {
        return componenteRepository.findAll();
    }

    // Obtener componente por ID
    public Componente obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del componente no puede ser nulo");
        }
        return componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente no encontrado"));
    }

    // Obtener componentes por equipo
    public List<Componente> obtenerPorEquipo(Long equipoId) {
        if (equipoId == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        if (!equipoRepository.existsById(equipoId)) {
            throw new RuntimeException("Equipo no encontrado");
        }
        return componenteRepository.findByEquipoId(equipoId);
    }

    // Crear componente
    public Componente crearComponente(Componente componente) {
        if (componente == null || componente.getNumeroParte() == null) {
            throw new IllegalArgumentException("El componente y su número de parte no pueden ser nulos");
        }
        if (componente.getEquipo() == null || componente.getEquipo().getId() == null) {
            throw new IllegalArgumentException("El componente debe estar asociado a un equipo");
        }
        if (componenteRepository.existsByNumeroParte(componente.getNumeroParte())) {
            throw new RuntimeException("Ya existe un componente con ese número de parte");
        }
        return componenteRepository.save(componente);
    }


    // Eliminar componente
    public void eliminarComponente(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del componente no puede ser nulo");
        }
        if (!componenteRepository.existsById(id)) {
            throw new RuntimeException("Componente no encontrado");
        }
        componenteRepository.deleteById(id);
    }
}
