package EduData.service;

import EduData.entity.Docente;
import EduData.repository.DocenteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteServicio {

    @Autowired
    private DocenteRepositorio docenteRepositorio;

    public List<Docente> obtenerTodos() {
        return docenteRepositorio.findAll();
    }

    public Optional<Docente> obtenerPorId(Long id) {
        return docenteRepositorio.findById(id);
    }

    public Docente crear(Docente docente) {
        return docenteRepositorio.save(docente);
    }

    public Docente actualizar(Long id, Docente docenteActualizado) {
        return docenteRepositorio.findById(id).map(docente -> {
            docente.setNombre(docenteActualizado.getNombre());
            docente.setEmail(docenteActualizado.getEmail());
            docente.setEspecialidad(docenteActualizado.getEspecialidad());
            return docenteRepositorio.save(docente);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        docenteRepositorio.deleteById(id);
    }
}
