package com.maint_up.backend.repository;

import com.maint_up.backend.model.OrdenTrabajoAsignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenTrabajoAsignacionRepository extends JpaRepository<OrdenTrabajoAsignacion, Long> {
    List<OrdenTrabajoAsignacion> findByOrdenTrabajoId(Long ordenTrabajoId);
    List<OrdenTrabajoAsignacion> findByUsuarioId(Long usuarioId);
}
