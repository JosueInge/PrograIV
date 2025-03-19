const materia = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            materias: [],
            materia: {
                codigo: '',
                nombre: '',
                uv: '',
                codigo_transaccion: uuidv4()
            },
        };
    },
    methods: {
        buscarMateria() {
            this.forms.buscarMateria.mostrar = !this.forms.buscarMateria.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia) {
            this.accion = 'modificar';
            this.materia = { ...materia };
        },
        guardarMateria() {
            let materia = { ...this.materia };

            if (!navigator.onLine) {
                db.materias.put(materia)
                    .then(() => {
                        this.guardarEnPendientes(materia);
                        alertify.warning("No hay internet. Los datos se guardaron localmente.");
                    })
                    .catch(error => console.error("Error al guardar en IndexedDB:", error));
                this.nuevoMateria();
                return;
            }

            db.materias.put(materia);
            fetch(`private/modulos/materias/materia.php?accion=${this.accion}&materias=${JSON.stringify(materia)}`)
                .then(response => response.json())
                .then(data => {
                    if (data !== true) {
                        alertify.error(data);
                    } else {
                        this.nuevoMateria();
                        this.$emit('buscar');
                    }
                })
                .catch(error => {
                    console.error("Error al enviar a la nube:", error);
                    this.guardarEnPendientes(materia);
                    alertify.warning("Error en la conexión. Datos guardados localmente.");
                });
        },

        guardarEnPendientes(materia) {
            let pendientes = JSON.parse(localStorage.getItem('pendientes_materias')) || [];
            let existe = pendientes.some(p => p.codigo_transaccion === materia.codigo_transaccion);

            if (!existe) {
                pendientes.push(materia);
                localStorage.setItem('pendientes_materias', JSON.stringify(pendientes));
                console.log("Materia guardada en pendientes:", materia);
            }
        },

        sincronizarPendientes() {
            let pendientes = JSON.parse(localStorage.getItem('pendientes_materias')) || [];
            if (pendientes.length === 0) return;

            console.log("Intentando sincronizar materias pendientes...");

            pendientes.forEach((materia, index) => {
                fetch(`private/modulos/materias/materia.php?accion=nuevo&materias=${JSON.stringify(materia)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data === true) {
                            console.log("Materia sincronizada con éxito:", materia);
                            pendientes.splice(index, 1);
                            localStorage.setItem('pendientes_materias', JSON.stringify(pendientes));
                        } else {
                            console.error("Error en sincronización:", data);
                        }
                    })
                    .catch(error => console.error("Error al sincronizar:", error));
            });
        },

        nuevoMateria() {
            this.accion = 'nuevo';
            this.materia = {
                codigo: '',
                nombre: '',
                uv: '',
                codigo_transaccion: uuidv4()
            };
        }
    },
    mounted() {
        // 🔹 Detectar cuando vuelve el internet y sincronizar pendientes
        window.addEventListener("online", this.sincronizarPendientes);
    },
    beforeUnmount() {
        // 🔹 Eliminar el evento cuando el componente se destruye
        window.removeEventListener("online", this.sincronizarPendientes);
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmMateria" name="frmMateria" @submit.prevent="guardarMateria">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Materias</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="materia.codigo" type="text" name="txtCodigoMateria" id="txtCodigoMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="materia.nombre" type="text" name="txtNombreMateria" id="txtNombreMateria" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">UV</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="materia.uv" type="number" name="txtUVMateria" id="txtUVMateria" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary m-1"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning m-1"> 
                            <input type="button" @click="buscarMateria" value="Buscar" class="btn btn-info m-1">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
