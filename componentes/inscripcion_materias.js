const inscripcionMaterias = {
    props: ['forms'],
    data() {
        return {
            idInscripcion: '',
            alumno: '',
            fechainscripcion: '',
        };
    },
    methods: {
        guardarInscripcion() {
            console.log("Inscripción guardada:", this.idInscripcion, this.alumno, this.pechainscripcion);
        }
    },
    template: `
        <div class="row">
    <div class="col-6">
        <form @submit.prevent="guardarInscripcion">
            <div class="card border-dark mb-3">
                <div class="card-header bg-dark text-white">Inscripción de Materias</div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-3 col-md-3">alumno</div>
                        <div class="col-9 col-md-6">
                            <input v-model="Alumno" type="text" class="form-control" required>
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-3 col-md-3">Fecha de Inscripción</div>
                        <div class="col-9 col-md-6">
                            <input v-model="fechaInscripcion" type="date" class="form-control" required>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-dark text-center">
                    <button type="submit" class="btn btn-success m-1">Guardar</button>
                    <input type="reset" value="Nuevo" class="btn btn-warning m-1">
                    <input type="button" @click="buscarInscripcion" value="Buscar" class="btn btn-info m-1">
                </div>
            </div>
        </form>
    </div>
</div>

    `
};
