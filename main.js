const {createApp} = Vue;
const Dexie = window.Dexie,
    db = new Dexie('db_academico');

createApp({
    components: {
        alumno,
        materia,
    },
    data() {
        return {
            forms : {
                alumno: {mostrar: false},
                materia: {mostrar: false},
                matricula: {mostrar: false},
            },
        };
    },
    methods: {
        abrirFormulario(componente) {
            this.forms[componente].mostrar = !this.forms[componente].mostrar;
        }
    },
    created() {
        db.version(1).stores({
            alumnos: '++idAlumno, codigo, nombre, direccion, telefono, email',
            materia: '++idMateria, codigo, nombre, uv', 
        });
    }
}).mount('#app');

   