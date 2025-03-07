const busquedaMatricula = {
    data() {
        return {
            buscar: '', // Término de búsqueda
            buscarTipo: 'alumno', // Campo por el cual se buscará (alumno, codigo, periodo, etc.)
            matriculas: [] // Lista de matrículas
        };
    },
    methods: {
        async listarMatriculas() {
            // Obtener todas las matrículas que coincidan con el término de búsqueda
            this.matriculas = await db.matriculas
                .filter(matricula => matricula[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase()))
                .toArray();
        },
        eliminarMatricula(matricula) {
            alertify.confirm('Eliminar Matrícula', `¿Está seguro de eliminar la matrícula de ${matricula.alumno}?`, () => {
                db.matriculas.delete(matricula.idMatricula); // Eliminar la matrícula de la base de datos
                this.listarMatriculas(); // Actualizar la lista
                alertify.success(`Matrícula de ${matricula.alumno} eliminada`);
            }, () => { });
        }
    },
    created() {
        this.listarMatriculas(); // Cargar las matrículas al crear el componente
    },
    template: `
        <div class="row">
            <div class="col-8">
                <table class="table table-sm table-bordered table-hover text-center">
                    <thead>
                        <tr>
                            <th>BUSCAR POR</th>
                            <th>
                                <select v-model="buscarTipo" class="form-control">
                                    <option value="codigo">Código</option>
                                    <option value="alumno">Alumno</option>
                                    <option value="fechamatricula">Fecha Matrícula</option>
                                    <option value="periodo">Periodo</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarMatriculas()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>Código</th>
                            <th>Alumno</th>
                            <th>Fecha Matrícula</th>
                            <th>Periodo</th>
                            <th>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="matricula in matriculas" :key="matricula.idMatricula">
                            <td>{{ matricula.codigo }}</td>
                            <td>{{ matricula.alumno }}</td>
                            <td>{{ matricula.fechamatricula }}</td>
                            <td>{{ matricula.periodo }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarMatricula(matricula)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};