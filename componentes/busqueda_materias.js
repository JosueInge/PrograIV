    
 const buscarmateria = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            materias: [],
        }
    },
    methods: {
        modificarMateria(materia){
            this.$emit('modificar', materia);
        },
        eliminarMateria(materia) {
            alertify.confirm('Eliminar Materia', `¿Esta seguro de eliminar el materia ${materia.nombre}?`, async() => {
                let respuesta = await fetch(`private/modulos/materias/materia.php?accion=eliminar&materias=${JSON.stringify(materia)}`),
                    data = await respuesta.json();
                if( data != true ){
                    alertify.error(data);
                }else{
                    db.materias.delete(materia.codigo_transaccion);
                    this.listarMaterias();
                    alertify.success(`Materia ${materia.nombre} eliminado`);
                }
            }, () => { });
        },
        async listarMaterias() {
            this.materias = await db.materias.filter(materia => materia[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
            if (this.materias.length<1) {
                fetch('private/modulos/materias/materia.php?accion=consultar')
                    .then(response => response.json())
                    .then(data => {
                        this.materias = data;
                        db.materias.bulkAdd(data);
                    });
            }
        },
    },
    created() {
        this.listarMaterias();
    },
    template: `
        <div class="row">
            <div class="col-6">
               <table class="table table-sm table-bordered table-hover text-center border border-2 border-dark">
                    <thead>
                        <tr>
                            <th>BUSCAR POR</th>
                            <th>
                                <select v-model="buscarTipo" class="form-control border border-2 border-dark">
                                    <option value="codigo">CODIGO</option>
                                    <option value="nombre">NOMBRE</option>
                                    <option value="uv">UV</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarMaterias()" v-model="buscar" class="form-control border border-2 border-dark">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>UV</th>  
                            <th>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="materia in materias" @click="modificarMateria(materia)" :key="materia.codigo_transaccion">
                            <td>{{ materia.codigo }}</td>
                            <td>{{ materia.nombre }}</td>
                            <td>{{ materia.uv }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarMateria(materia)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};