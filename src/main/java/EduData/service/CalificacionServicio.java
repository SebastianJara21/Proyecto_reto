package EduData.service;

import EduData.entity.Calificacion;
import EduData.repository.CalificacionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CalificacionServicio {

    @Autowired
    private CalificacionRepositorio calificacionRepositorio;

    public List<Calificacion> obtenerTodas() {
        return calificacionRepositorio.findAll();
    }

    public Optional<Calificacion> obtenerPorId(Long id) {
        return calificacionRepositorio.findById(id);
    }

    public Calificacion crear(Calificacion calificacion) {
        return calificacionRepositorio.save(calificacion);
    }

    public Calificacion actualizar(Long id, Calificacion calificacionActualizada) {
        return calificacionRepositorio.findById(id).map(c -> {
            c.setTipo(calificacionActualizada.getTipo());
            c.setValor(calificacionActualizada.getValor());
            c.setFecha(calificacionActualizada.getFecha());
            c.setMatricula(calificacionActualizada.getMatricula());
            return calificacionRepositorio.save(c);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        calificacionRepositorio.deleteById(id);
    }
}
