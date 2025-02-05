const {createApp} = Vue;

createApp({
    data() {
        return {
            alumnos: [],
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            municipio: '',
            departamento: '',
            distrito: '',
            fechaNacimiento: '',
            genero: '',
            busqueda: ''
            
        };
    },
    computed: {
        alumnosFiltrados() {
            return this.alumnos.filter(alumno => {
                return (
                    alumno.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    alumno.codigo.toLowerCase().includes(this.busqueda.toLowerCase())
                );
            });
        }
    },
    methods: {
        eliminarAlumno(alumno) {
            if (confirm(`¿Estas seguro de eliminar el alumno ${alumno.nombre}?`)){
                localStorage.removeItem(alumno.codigo);
                this.listarAlumnos();
            }
        },
        verAlumno(alumno) {
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.telefono = alumno.telefono;
            this.email = alumno.email;
            this.municipio = alumno.municipio;
            this.departamento = alumno.departamento;
            this.distrito = alumno.distrito;
            this.fechaNacimiento = alumno.fechaNacimiento;
            this.genero = alumno.genero
        },
        guardarAlumno() {
            let alumno = {
                codigo: this.codigo,
                nombre: this.nombre,
                direccion: this.direccion,
                telefono: this.telefono,
                email: this.email,
                municipio: this.municipio,
                departamento: this.departamento,
                distrito: this.distrito,
                fechaNacimiento: this.fechaNacimiento,
                genero: this.genero

            };
            localStorage.setItem(this.codigo, JSON.stringify(alumno));
            this.listarAlumnos();
            this.limpiarFormulario();
        },
        listarAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let clave = localStorage.key(i),
                    valor = localStorage.getItem(clave);
                this.alumnos.push(JSON.parse(valor));
            }
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
            this.municipio = '';
            this.departamento = '';
            this.distrito = '';
            this.fechaNacimiento = '';
            this.genero = '';
        }
    },
    created() {
       this.listarAlumnos();
    }
}).mount('#app');