const alumno = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            alumno: {
                codigo: '',
                nombre: '',
                direccion: '',
                telefono: '',
                email: '',
                codigo_transaccion: uuidv4()
            },
        }
    },
    methods: {
        buscarAlumno() {
            this.forms.buscarAlumno.mostrar = !this.forms.buscarAlumno.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.alumno = { ...alumno };
        },
        guardarAlumno() {
            let alumno = { ...this.alumno };

            if (!navigator.onLine) {
                db.alumnos.put(alumno)
                    .then(() => {
                        this.guardarEnPendientes(alumno);
                        alertify.warning("No hay internet. Los datos se guardaron localmente.");
                        this.nuevoAlumno();
                    })
                    .catch(error => console.error("Error al guardar en IndexedDB:", error));
                return;
            }

            db.alumnos.put(alumno);
            fetch(`private/modulos/alumnos/alumno.php?accion=${this.accion}&alumnos=${JSON.stringify(alumno)}`)
                .then(response => response.json())
                .then(data => {
                    if (data !== true) {
                        alertify.error(data);
                    } else {
                        this.nuevoAlumno();
                        this.$emit('buscar');
                    }
                })
                .catch(error => {
                    console.error("Error al enviar a la nube:", error);
                    this.guardarEnPendientes(alumno);
                    alertify.warning("Error en la conexión. Datos guardados localmente.");
                    this.nuevoAlumno();
                });
        },

        guardarEnPendientes(alumno) {
            let pendientes = JSON.parse(localStorage.getItem('pendientes')) || [];
            let existe = pendientes.some(p => p.codigo_transaccion === alumno.codigo_transaccion);
            
            if (!existe) {
                pendientes.push(alumno);
                localStorage.setItem('pendientes', JSON.stringify(pendientes));
                console.log("Alumno guardado en pendientes:", alumno);
            }
        },

        sincronizarPendientes() {
            let pendientes = JSON.parse(localStorage.getItem('pendientes')) || [];
            if (pendientes.length === 0) return;

            console.log("Intentando sincronizar datos pendientes...");

            let index = 0;
            const procesarPendiente = () => {
                if (index >= pendientes.length) return;

                let alumno = pendientes[index];

                fetch(`private/modulos/alumnos/alumno.php?accion=nuevo&alumnos=${JSON.stringify(alumno)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data === true) {
                            console.log("Alumno sincronizado con éxito:", alumno);
                            pendientes.splice(index, 1);
                            localStorage.setItem('pendientes', JSON.stringify(pendientes));
                        } else {
                            console.error("Error en sincronización:", data);
                            index++;
                        }
                        procesarPendiente(); 
                    })
                    .catch(error => {
                        console.error("Error al sincronizar:", error);
                        index++;
                        procesarPendiente();
                    });
            };

            procesarPendiente();
        },

        nuevoAlumno() {
            this.accion = 'nuevo';
            this.alumno = {
                codigo: '',
                nombre: '',
                direccion: '',
                telefono: '',
                email: '',
                codigo_transaccion: uuidv4()
            };
        }
    },
    mounted() {
        window.addEventListener("online", this.sincronizarPendientes);
    },
    beforeUnmount() {
        window.removeEventListener("online", this.sincronizarPendientes);
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmAlumno" name="frmAlumno" @submit.prevent="guardarAlumno">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Alumnos</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="alumno.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="alumno.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">DIRECCION</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="alumno.direccion" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELEFONO</div>
                                <div class="col-9 col-md-4">
                                    <input v-model="alumno.telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">EMAIL</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="alumno.email" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary m-1"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning m-1">
                            <input type="button" @click="buscarAlumno" value="Buscar" class="btn btn-info m-1">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
