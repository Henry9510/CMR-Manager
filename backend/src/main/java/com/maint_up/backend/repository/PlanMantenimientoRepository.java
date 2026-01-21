package com.maint_up.backend.repository;

import com.maint_up.backend.model.PlanMantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanMantenimientoRepository extends JpaRepository<PlanMantenimiento, Long> {
    List<PlanMantenimiento> findByEquipoId(Long equipoId);
    List<PlanMantenimiento> findByActivoTrue();
}
