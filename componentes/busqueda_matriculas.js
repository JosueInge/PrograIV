    
 const buscarmatricula = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombreAlumno',
            matriculas: [],
        }
    },
    methods: {
        modificarMatricula(matricula){
            this.$emit('modificar', matricula);
        },
        eliminarMatricula(matricula) {
            alertify.confirm('Eliminar Alumno', `¿Esta seguro de eliminar el alumno ${matricula.nombreAlumno}?`, () => {
                db.matriculas.delete(matricula.idMatricula);
                this.listarMatricula();
                alertify.success(`Matricula ${matricula.nombreAlumno} eliminado`);
            }, () => { });
        },
        async listarMatricula() {
            this.matriculas = await db.matriculas.filter(matricula => matricula[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
    },
    created() {
        this.listarMatricula();
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
                                    <option value="nombreAlumno">NOMBREALUMNO</option>
                                    <option value="fechaMatricula">FECHAMATRICULA</option>
                                    <option value="periodo">PERIODO</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarMatricula()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>Nombre Alumno</th>
                            <th>Fecha Matricula</th>
                            <th>periodo</th>
                            <th>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="matricula in matriculas" @click="modificarMatricula(matricula)" :key="matricula.idMatricula">
                            <td>{{ matricula.nombreAlumno }}</td>
                            <td>{{ matricula.fechaMatricula }}</td>
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