package com.maint_up.backend.service;

import com.maint_up.backend.model.Componente;
import com.maint_up.backend.dto.ComponenteDTO;
import com.maint_up.backend.repository.ComponenteRepository;
import com.maint_up.backend.repository.EquipoRepository;
import com.maint_up.backend.repository.CriticidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;
    private final EquipoRepository equipoRepository;
    private final CriticidadRepository criticidadRepository;

    public ComponenteService(ComponenteRepository componenteRepository,
                           EquipoRepository equipoRepository,
                           CriticidadRepository criticidadRepository) {
        this.componenteRepository = componenteRepository;
        this.equipoRepository = equipoRepository;
        this.criticidadRepository = criticidadRepository;
    }

    public List<Componente> obtenerTodos() {
        return componenteRepository.findAll();
    }

    public Componente obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del componente no puede ser nulo");
        }
        return componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente no encontrado"));
    }

    public List<Componente> obtenerPorEquipo(Long equipoId) {
        if (equipoId == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        if (!equipoRepository.existsById(equipoId)) {
            throw new RuntimeException("Equipo no encontrado");
        }
        return componenteRepository.findByEquipoId(equipoId);
    }

    public Componente crearComponente(ComponenteDTO dto) {
        if (dto == null || dto.nombre == null || dto.numeroParte == null) {
            throw new IllegalArgumentException("Nombre y número de parte son requeridos");
        }
        if (dto.equipoId == null) {
            throw new IllegalArgumentException("El componente debe estar asociado a un equipo");
        }
        
        Componente componente = new Componente();
        mapearDtoAComponente(dto, componente);
        return componenteRepository.save(componente);
    }

    public Componente actualizarComponente(Long id, ComponenteDTO dto) {
        Componente existente = obtenerPorId(id);
        mapearDtoAComponente(dto, existente);
        return componenteRepository.save(existente);
    }

    public void eliminarComponente(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del componente no puede ser nulo");
        }
        if (!componenteRepository.existsById(id)) {
            throw new RuntimeException("Componente no encontrado");
        }
        componenteRepository.deleteById(id);
    }

    private void mapearDtoAComponente(ComponenteDTO dto, Componente componente) {
        componente.setNombre(dto.nombre);
        componente.setNumeroParte(dto.numeroParte);
        componente.setDescripcion(dto.descripcion);
        
        if (dto.criticidadId != null) {
            componente.setCriticidad(criticidadRepository.findById(dto.criticidadId).orElse(null));
        }
        
        if (dto.equipoId != null) {
            componente.setEquipo(equipoRepository.findById(dto.equipoId)
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado")));
        }
    }
}
