package com.maint_up.backend.repository;

import com.maint_up.backend.model.Falla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FallaRepository extends JpaRepository<Falla, Long> {
    List<Falla> findByEquipoId(Long equipoId);
    List<Falla> findByOrdenTrabajoId(Long ordenTrabajoId);
}
