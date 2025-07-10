import { useState } from "react";
import api from "../services/api";

const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    title: {
        textAlign: 'center',
        color: '#34495e',
        marginBottom: '30px',
        fontSize: '2em',
        borderBottom: '2px solid #5a5c69',
        paddingBottom: '10px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#5a5c69',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1em',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px 20px',
        backgroundColor: '#4A90E2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '20px',
    },
    buttonHover: {
        backgroundColor: '#357ABD',
    }
};

function EstudianteForm() {
    const [formulario, setFormulario] = useState({
        identificacion: "",
        nombre: "",
        email: "",
        fechaNacimiento: "",
        genero: "",
        matriculaAnio: "",
        estado: "",
        nivel: "",
        grupo: ""
    });

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/estudiantes", formulario);
            alert("Estudiante creado correctamente");
            console.log(res.data);

        } catch (error) {
            alert("Error al registrar estudiante");
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Registrar Estudiante</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formulario).map((campo) => (
                    <div key={campo} style={styles.formGroup}>
                        <label style={styles.label}>
                            {campo.charAt(0).toUpperCase() + campo.slice(1).replace(/([A-Z])/g, ' $1')} {/* Formatea el nombre del campo */}
                        </label>
                        <input
                            type={campo === "fechaNacimiento" ? "date" : "text"}
                            name={campo}
                            value={formulario[campo]}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    style={styles.button}

                >
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default EstudianteForm;