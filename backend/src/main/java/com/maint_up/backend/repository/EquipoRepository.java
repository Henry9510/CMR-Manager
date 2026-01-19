package com.maint_up.backend.repository;

import com.maint_up.backend.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    Optional<Equipo> findByNumeroParte(String numeroParte);

    boolean existsByNumeroParte(String numeroParte);
}
