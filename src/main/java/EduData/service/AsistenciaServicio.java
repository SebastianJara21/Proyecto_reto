package EduData.service;

import EduData.entity.Asistencia;
import EduData.repository.AsistenciaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaServicio {

    @Autowired
    private AsistenciaRepositorio asistenciaRepositorio;

    public List<Asistencia> obtenerTodas() {
        return asistenciaRepositorio.findAll();
    }

    public Optional<Asistencia> obtenerPorId(Long id) {
        return asistenciaRepositorio.findById(id);
    }

    public Asistencia crear(Asistencia asistencia) {
        return asistenciaRepositorio.save(asistencia);
    }

    public Asistencia actualizar(Long id, Asistencia asistenciaActualizada) {
        return asistenciaRepositorio.findById(id).map(a -> {
            a.setFecha(asistenciaActualizada.getFecha());
            a.setPresente(asistenciaActualizada.getPresente());
            a.setMatricula(asistenciaActualizada.getMatricula());
            return asistenciaRepositorio.save(a);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        asistenciaRepositorio.deleteById(id);
    }
}
