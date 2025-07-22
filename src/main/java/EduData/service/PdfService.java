package EduData.service;

import EduData.entity.Estudiante;
import EduData.repository.EstudianteRepositorio;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final EstudianteRepositorio estudianteRepositorio;

    public byte[] generateEstudiantesPdf() throws Exception {
        List<Estudiante> estudiantes = estudianteRepositorio.findAll();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Título
        document.add(new Paragraph("LISTADO DE ESTUDIANTES")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold());

        document.add(new Paragraph("Fecha de generación: " + 
                java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10));

        document.add(new Paragraph("\n"));

        // Crear tabla
        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2, 2, 2, 1, 1}));
        table.setWidth(UnitValue.createPercentValue(100));

        // Headers
        table.addHeaderCell(new Cell().add(new Paragraph("ID").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Identificación").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Nombre Completo").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Correo").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Teléfono").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Estado").setBold()));

        // Datos
        for (Estudiante estudiante : estudiantes) {
            table.addCell(new Cell().add(new Paragraph(estudiante.getId().toString())));
            table.addCell(new Cell().add(new Paragraph(estudiante.getIdentificacion() != null ? estudiante.getIdentificacion() : "")));
            table.addCell(new Cell().add(new Paragraph((estudiante.getNombre() != null ? estudiante.getNombre() : "") + " " + 
                    (estudiante.getApellido() != null ? estudiante.getApellido() : ""))));
            table.addCell(new Cell().add(new Paragraph(estudiante.getCorreo() != null ? estudiante.getCorreo() : "")));
            table.addCell(new Cell().add(new Paragraph(estudiante.getTelefono() != null ? estudiante.getTelefono() : "")));
            table.addCell(new Cell().add(new Paragraph(estudiante.getEstado() != null ? estudiante.getEstado() : "Activo")));
        }

        document.add(table);

        // Pie de página
        document.add(new Paragraph("\n\nTotal de estudiantes: " + estudiantes.size())
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold());

        document.close();
        
        return baos.toByteArray();
    }

    public byte[] generateEstudiantePdf(Long id) throws Exception {
        Estudiante estudiante = estudianteRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        // Título
        document.add(new Paragraph("FICHA DEL ESTUDIANTE")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(18)
                .setBold());

        document.add(new Paragraph("\n"));

        // Información personal
        document.add(new Paragraph("INFORMACIÓN PERSONAL").setBold().setFontSize(14));
        document.add(new Paragraph("ID: " + estudiante.getId()));
        document.add(new Paragraph("Identificación: " + (estudiante.getIdentificacion() != null ? estudiante.getIdentificacion() : "N/A")));
        document.add(new Paragraph("Nombre: " + (estudiante.getNombre() != null ? estudiante.getNombre() : "N/A")));
        document.add(new Paragraph("Apellido: " + (estudiante.getApellido() != null ? estudiante.getApellido() : "N/A")));
        document.add(new Paragraph("Correo: " + (estudiante.getCorreo() != null ? estudiante.getCorreo() : "N/A")));
        document.add(new Paragraph("Teléfono: " + (estudiante.getTelefono() != null ? estudiante.getTelefono() : "N/A")));
        document.add(new Paragraph("Dirección: " + (estudiante.getDireccion() != null ? estudiante.getDireccion() : "N/A")));
        document.add(new Paragraph("Género: " + (estudiante.getGenero() != null ? estudiante.getGenero() : "N/A")));
        document.add(new Paragraph("Fecha de Nacimiento: " + (estudiante.getFechaNacimiento() != null ? 
                estudiante.getFechaNacimiento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "N/A")));

        document.add(new Paragraph("\n"));

        // Información académica
        document.add(new Paragraph("INFORMACIÓN ACADÉMICA").setBold().setFontSize(14));
        document.add(new Paragraph("Año de Matrícula: " + (estudiante.getMatriculaAnio() != null ? estudiante.getMatriculaAnio() : "N/A")));
        document.add(new Paragraph("Estado: " + (estudiante.getEstado() != null ? estudiante.getEstado() : "Activo")));
        document.add(new Paragraph("Nivel: " + (estudiante.getNivel() != null ? estudiante.getNivel() : "N/A")));
        document.add(new Paragraph("Grupo: " + (estudiante.getGrupo() != null ? estudiante.getGrupo() : "N/A")));

        document.add(new Paragraph("\n\nFecha de generación: " + 
                java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(10));

        document.close();
        
        return baos.toByteArray();
    }
}
