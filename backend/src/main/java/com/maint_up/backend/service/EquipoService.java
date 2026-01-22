package com.maint_up.backend.service;

import com.maint_up.backend.model.Equipo;
import com.maint_up.backend.dto.EquipoDTO;
import com.maint_up.backend.repository.EquipoRepository;
import com.maint_up.backend.repository.UbicacionRepository;
import com.maint_up.backend.repository.EstadoEquipoRepository;
import com.maint_up.backend.repository.CriticidadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

    private static final Logger logger = LoggerFactory.getLogger(EquipoService.class);

    private final EquipoRepository equipoRepository;
    private final UbicacionRepository ubicacionRepository;
    private final EstadoEquipoRepository estadoEquipoRepository;
    private final CriticidadRepository criticidadRepository;

    public EquipoService(EquipoRepository equipoRepository,
                        UbicacionRepository ubicacionRepository,
                        EstadoEquipoRepository estadoEquipoRepository,
                        CriticidadRepository criticidadRepository) {
        this.equipoRepository = equipoRepository;
        this.ubicacionRepository = ubicacionRepository;
        this.estadoEquipoRepository = estadoEquipoRepository;
        this.criticidadRepository = criticidadRepository;
    }

    public List<Equipo> obtenerTodos() {
        return equipoRepository.findAll();
    }

    public Equipo obtenerPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del equipo no puede ser nulo");
        }
        return equipoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    public Equipo crearEquipo(@NonNull EquipoDTO dto) {
        if (dto == null || dto.nombre == null || dto.codigo == null) {
            logger.warn("Intento de crear equipo con datos inválidos");
            throw new IllegalArgumentException("Nombre y código son requeridos");
        }
        if (equipoRepository.existsByCodigo(dto.codigo)) {
            logger.warn("Intento de crear equipo con código duplicado: {}", dto.codigo);
            throw new RuntimeException("Ya existe un equipo con ese código");
        }
        
        Equipo equipo = new Equipo();
        mapearDtoAEquipo(dto, equipo);
        Equipo saved = equipoRepository.save(equipo);
        logger.info("Equipo creado: id={}, nombre={}, codigo={}", saved.getId(), saved.getNombre(), saved.getCodigo());
        return saved;
    }

    public Equipo actualizarEquipo(@NonNull Long id, @NonNull EquipoDTO dto) {
        Equipo existente = obtenerPorId(id);
        mapearDtoAEquipo(dto, existente);
        return equipoRepository.save(existente);
    }

    public void eliminarEquipo(@NonNull Long id) {
        Equipo equipo = obtenerPorId(id);
        equipoRepository.delete(equipo);
        logger.info("Equipo eliminado: id={}, nombre={}", id, equipo.getNombre());
    }

    private void mapearDtoAEquipo(EquipoDTO dto, Equipo equipo) {
        equipo.setNombre(dto.nombre);
        equipo.setCodigo(dto.codigo);
        
        if (dto.horasMantenimiento != null) {
            equipo.setHorasMantenimiento(dto.horasMantenimiento);
        } else {
            equipo.setHorasMantenimiento(500f);
        }
        if (dto.ubicacionId != null) {
            equipo.setUbicacion(ubicacionRepository.findById(dto.ubicacionId).orElse(null));
        }
        if (dto.estadoId != null) {
            equipo.setEstado(estadoEquipoRepository.findById(dto.estadoId).orElse(null));
        }
        if (dto.criticidadId != null) {
            equipo.setCriticidad(criticidadRepository.findById(dto.criticidadId).orElse(null));
        }
    }
}
