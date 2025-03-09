    
 const buscarinscripcion = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombreAlumno',
            inscripciones: [],
        }
    },
    methods: {
        modificarInscripcion(inscripcion){
            this.$emit('modificar', inscripcion);
        },
        eliminarInscripcion(inscripcion) {
            alertify.confirm('Eliminar Alumno', `¿Esta seguro de eliminar el alumno ${inscripcion.nombreAlumno}?`, () => {
                db.inscripciones.delete(inscripcion.idInscripcion);
                this.listarInscripcion();
                alertify.success(`Inscripcion ${inscripcion.nombreAlumno} eliminado`);
            }, () => { });
        },
        async listarInscripcion() {
            this.inscripciones = await db.inscripciones.filter(inscripcion => inscripcion[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
    },
    created() {
        this.listarInscripcion();
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
                                    <option value="nombreAlumno">Nombre Alumno</option>
                                    <option value="asignatura">Materias</option>
                                    <option value="fechaInscripcion">Fecha Inscripcion</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarInscripcion()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>Nombre Alumno</th>
                            <th>Materias</th>
                            <th>Fecha Inscripcion</th>
                            <th>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="inscripcion in inscripciones" @click="modificarInscripcion(inscripcion)" :key="inscripcion.idInscripcion">
                            <td>{{ inscripcion.nombreAlumno }}</td>
                            <td>{{ inscripcion.asignatura }}</td>
                            <td>{{ inscripcion.fechaInscripcion }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarInscripcion(inscripcion)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};