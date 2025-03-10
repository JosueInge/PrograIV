const matricula = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idMatricula: '',
            nombreAlumno: '',
            fechaMatricula: '',
            periodo: '',
            alumnos: [],
        }
    },
    methods: {
        async cargarAlumnos() {
            try {
                this.alumnos = await db.alumnos.toArray();
            } catch (error) {
                console.error("Error cargando alumnos:", error);
            }
        },
        buscarMatricula() {
            this.forms.buscarMatricula.mostrar = !this.forms.buscarMatricula.mostrar;
            this.$emit('buscar');
        },
        modificarMatricula(matricula) {
            this.accion = 'modificar';
            this.idMatricula = matricula.idMatricula;
            this.nombreAlumno = matricula.nombreAlumno;
            this.fechaMatricula = matricula.fechaMatricula;
            this.periodo = alumno.periodo;
        },
        guardarMatricula() {
            let matricula = {
                nombreAlumno: this.nombreAlumno,
                fechaMatricula: this.fechaMatricula,
                periodo: this.periodo
            };
            if (this.accion == 'modificar') {
                matricula.idMatricula = this.idMatricula;
            }
            db.matriculas.put(matricula);
            this.nuevaMatricula();
        },
        nuevaMatricula() {
            this.accion = 'nuevo';
            this.idMatricula = '';
            this.nombreAlumno = '';
            this.fechaMatricula = '';
            this.periodo = '';
        }
    },
    mounted() {
        this.cargarAlumnos();
    },
    template: `
        <div class="row">
            <div class="col-6">
               <form id="frmMatricula" name="frmMatricula" @submit.prevent="guardarMatricula">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Matrícula de Alumno</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Nombre Alumno</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="nombreAlumno" class="form-control" required>
                                        <option value="" disabled>Seleccione un alumno</option>
                                        <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.nombre">
                                            {{ alumno.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Fecha de Matricula</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="fechaMatricula" type="date" class="form-control" required>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Periodo</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="periodo" name="txtperiodo" id="txtperiodo" class="form-control">
                                    <option value="">Seleccione un periodo</option>    
                                    <option value="ciclo_I_2025">ciclo_I_2025</option>
                                    <option value="ciclo_II_2025">ciclo_II_2025</option>
                                    <option value="ciclo_I_2026">ciclo_I_2026</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <button type="submit" class="btn btn-success m-1">Guardar</button>
                            <input type="reset" value="Nuevo" class="btn btn-warning m-1">
                            <input type="button" @click="buscarMatricula" value="Buscar" class="btn btn-info m-1">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
