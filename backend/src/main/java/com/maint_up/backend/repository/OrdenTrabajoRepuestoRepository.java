package com.maint_up.backend.repository;

import com.maint_up.backend.model.OrdenTrabajoRepuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenTrabajoRepuestoRepository extends JpaRepository<OrdenTrabajoRepuesto, Long> {
    List<OrdenTrabajoRepuesto> findByOrdenTrabajoId(Long ordenTrabajoId);
}
