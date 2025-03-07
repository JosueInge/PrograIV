const matriculaAlumno = {
    props: ['forms'],
    data() {
        return {
            idMatricula: '',
            codigo: '',
            alumno: '',
            fechamatricula: '',
            periodo: '',
            alumnosRegistrados: [], // Lista de alumnos registrados
            alumnoSeleccionado: null, // Alumno seleccionado
            matriculas: [], // Lista de alumnos matriculados
            mostrarMatriculas: false // Controla la visibilidad de la tabla
        };
    },
    methods: {
        async buscarAlumnos() {
            // Obtener la lista de alumnos registrados
            this.alumnosRegistrados = await db.alumnos.toArray();
        },
        seleccionarAlumno(alumno) {
            this.alumnoSeleccionado = alumno;
            this.alumno = alumno.nombre; // Mostrar el nombre del alumno seleccionado
        },
        async guardarMatricula() {
            if (!this.alumnoSeleccionado) {
                alertify.error('Debe seleccionar un alumno válido.');
                return;
            }

            const matricula = {
                idMatricula: this.idMatricula,
                codigo: this.codigo,
                idAlumno: this.alumnoSeleccionado.idAlumno, // Guardar el ID del alumno
                alumno: this.alumnoSeleccionado.nombre, // Guardar el nombre del alumno
                fechamatricula: this.fechamatricula,
                periodo: this.periodo
            };

            // Guardar la matrícula en la base de datos
            await db.matriculas.put(matricula);
            alertify.success('Matrícula guardada correctamente.');

            // Limpiar el formulario
            this.nuevoMatricula();
        },
        async listarMatriculas() {
            // Obtener todas las matrículas registradas
            this.matriculas = await db.matriculas.toArray();
            this.mostrarMatriculas = true; // Mostrar la tabla al hacer clic en "Buscar"
        },
        nuevoMatricula() {
            this.idMatricula = '';
            this.codigo = '';
            this.alumno = '';
            this.fechamatricula = '';
            this.periodo = '';
            this.alumnoSeleccionado = null;
        }
    },
    created() {
        this.buscarAlumnos(); // Cargar la lista de alumnos al crear el componente
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form @submit.prevent="guardarMatricula">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Matrícula de Alumno</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Código</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="codigo" type="text" class="form-control" required>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Alumno</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="alumno" type="text" class="form-control" required
                                        @input="buscarAlumnos" placeholder="Buscar alumno...">
                                    <ul v-if="alumnosRegistrados.length > 0" class="list-group">
                                        <li v-for="alumno in alumnosRegistrados" :key="alumno.idAlumno"
                                            class="list-group-item list-group-item-action"
                                            @click="seleccionarAlumno(alumno)">
                                            {{ alumno.nombre }} ({{ alumno.codigo }})
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Fecha Matrícula</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="fechamatricula" type="date" class="form-control" required>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-3">Periodo</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="periodo" class="form-control" required>
                                        <option value="Ciclo I - 2025">Ciclo I - 2025</option>
                                        <option value="Ciclo II - 2025">Ciclo II - 2025</option>
                                        <option value="Ciclo I - 2026">Ciclo I - 2026</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <button type="submit" class="btn btn-success m-1">Guardar</button>
                            <input type="reset" value="Nuevo" class="btn btn-warning m-1">
                            <input type="button" @click="listarMatriculas" value="Buscar" class="btn btn-info m-1">
                        </div>
                    </div>
                </form>
            </div>

            <!-- Tabla de alumnos matriculados (solo se muestra al hacer clic en "Buscar") -->
            <div class="col-6" v-if="mostrarMatriculas">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white">Alumnos Matriculados</div>
                    <div class="card-body">
                        <table class="table table-sm table-bordered table-hover text-center">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Alumno</th>
                                    <th>Fecha Matrícula</th>
                                    <th>Periodo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="matricula in matriculas" :key="matricula.idMatricula">
                                    <td>{{ matricula.codigo }}</td>
                                    <td>{{ matricula.alumno }}</td>
                                    <td>{{ matricula.fechamatricula }}</td>
                                    <td>{{ matricula.periodo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};