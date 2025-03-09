const inscripcion = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idInscripcion: '',
            nombreAlumno: '',
            asignatura: '',
            fechaInscripcion: '',
            matriculas: [],
            materias: [],
        };
    },
    methods: {
        async cargarMaterias() {
            try {
                this.materias = await db.materias.toArray();
            } catch (error) {
                console.error("Error cargando materias:", error);
            }
        },
        async cargarMatriculas() {
            try {
                this.matriculas = await db.matriculas.toArray();
            } catch (error) {
                console.error("Error cargando alumnos:", error);
            }
        },
        buscarInscripcion() {
            this.forms.buscarInscripcion.mostrar = !this.forms.buscarInscripcion.mostrar;
            this.$emit('buscar');
        },
        modificarInscripcion(inscripcion) {
            this.accion = 'modificar';
            this.idInscripcion = inscripcion.idInscripcion;
            this.nombreAlumno = inscripcion.nombreAlumno;
            this.asignatura = inscripcion.asignatura;
            this.fechaInscripcion = inscripcion.fechaInscripcion;
        },
        guardarInscripcion() {
            let inscripcion = {
                nombreAlumno: this.nombreAlumno,
                asignatura: this.asignatura,
                fechaInscripcion: this.fechaInscripcion,
            };
            if (this.accion == 'modificar') {
                inscripcion.idInscripcion = this.idInscripcion;
            }
            db.inscripciones.put(inscripcion);
            this.nuevaInscripcion();
        },  
        nuevaInscripcion() {
            this.accion = 'nuevo';
            this.idInscripcion = '';
            this.nombreAlumno = '';
            this.asignatura = '';
            this.fechaInscripcion = '';
        }      
    },
    mounted() {
        this.cargarMaterias();
        this.cargarMatriculas();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmInscripcion" name="frmInscripcion" @submit.prevent="guardarInscripcion">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Inscripcion de Materia</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Nombre Alumno</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="nombreAlumno" class="form-control" required>
                                        <option value="" disabled>Seleccione un alumno</option>
                                        <option v-for="matricula in matriculas" :key="matricula.id" :value="matricula.nombreAlumno">
                                            {{ matricula.nombreAlumno }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Materia</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="asignatura" class="form-control" required>
                                        <option value="" disabled>Seleccione una materia</option>
                                        <option v-for="materia in materias" :key="materia.id" :value="materia.nombre">
                                            {{ materia.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Fecha de Inscripcion</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="fechaInscripcion" type="date" class="form-control" required>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary m-1"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning m-1">
                            <input type="button" @click="buscarInscripcion" value="Buscar" class="btn btn-info m-1">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
