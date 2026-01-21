package com.maint_up.backend.service;

import com.maint_up.backend.model.Componente;
import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.dto.ComponenteDTO;
import com.maint_up.backend.repository.ComponenteRepository;
import com.maint_up.backend.repository.EquipoRepository;

import jakarta.transaction.Transactional;

import com.maint_up.backend.repository.CriticidadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComponenteService {

    private static final Logger logger = LoggerFactory.getLogger(ComponenteService.class);

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

    public Componente crearComponente(@NonNull ComponenteDTO dto) {
        if (dto == null || dto.nombre == null || dto.numeroParte == null) {
            logger.warn("Intento de crear componente con datos inválidos");
            throw new IllegalArgumentException("Nombre y número de parte son requeridos");
        }
        if (dto.equipoId == null) {
            logger.warn("Intento de crear componente sin equipoId");
            throw new IllegalArgumentException("El componente debe estar asociado a un equipo");
        }

        Componente componente = new Componente();
        mapearDtoAComponente(dto, componente);
        Componente saved = componenteRepository.save(componente);
        logger.info("Componente creado: id={}, nombre={}", saved.getId(), saved.getNombre());
        return saved;
    }

    public Componente actualizarComponente(@NonNull Long id, @NonNull ComponenteDTO dto) {
        Componente existente = obtenerPorId(id);
        mapearDtoAComponente(dto, existente);
        return componenteRepository.save(existente);
    }

    @Transactional
    public void eliminarComponente(@NonNull Long id) {
        Componente componente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente no encontrado"));

        Equipo equipo = componente.getEquipo();

        if (equipo != null) {
            equipo.getComponentes().remove(componente);
            componente.setEquipo(null);
        }

        logger.info("Componente eliminado correctamente: id={}", id);
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
