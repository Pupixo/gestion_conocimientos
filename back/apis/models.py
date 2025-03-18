from django.db import models
from django.contrib.auth.models import User

class Roles(models.Model):
    role_name = models.CharField(max_length=100, null=False, blank=False, default="")
    description = models.CharField(max_length=100, null=False, blank=False, default="")
    acronimo = models.CharField(max_length=50, null=False, blank=False, default="")

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class Pais(models.Model):
    nombre = models.CharField(max_length=250, null=False, blank=False, default="")
    codigopais = models.CharField(max_length=3, null=False, blank=False, unique=True, default="")

    class Meta:
        ordering = ("nombre",)
        verbose_name = "País"
        verbose_name_plural = "Países"

    def __str__(self):
        return self.nombre

class Departamento(models.Model):
    nombre = models.CharField(max_length=255, null=True, blank=True)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, related_name='departamentos')

    class Meta:
        ordering = ("nombre",)
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"

    def __str__(self):
        return self.nombre or "Sin nombre"

class Provincia(models.Model):
    nombre = models.CharField(max_length=45)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='provincia')

    class Meta:
        ordering = ("nombre",)

    def __str__(self):
        return self.nombre

class Distrito(models.Model):
    nombre = models.CharField(max_length=45)
    provincia = models.ForeignKey(Provincia, on_delete=models.CASCADE, related_name='districto')
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='districto')

    class Meta:
        ordering = ("nombre",)

    def __str__(self):
        return self.nombre

class NocsGrupos(models.Model):
    noc_name = models.CharField(max_length=250, null=False, blank=False, default="")
    description = models.CharField(max_length=800, null=False, blank=False, default="")
    acronimo = models.CharField(max_length=50, null=False, blank=False, default="")
  
    pais = models.ForeignKey(Pais, on_delete=models.SET_NULL, null=True, blank=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    provincia = models.ForeignKey(Provincia, on_delete=models.SET_NULL, null=True, blank=True)
    distrito = models.ForeignKey(Distrito, on_delete=models.SET_NULL, null=True, blank=True)
    direccion = models.CharField(max_length=500, null=True, blank=True, default="")
    localidad = models.CharField(max_length=255, null=True, blank=True, default="")
    referencia = models.CharField(max_length=500, null=True, blank=True, default="")

    usuario_reg = models.IntegerField(null=True, blank=True, default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True, default=None)
    editado = models.DateTimeField(null=True, blank=True, default=None)

    usuario_elim = models.IntegerField(null=True, blank=True, default=None)
    eliminado = models.DateTimeField(null=True, blank=True, default=None)

    status = models.BooleanField(null=True, blank=True, default=None)

    class Meta:
        ordering = ("pk",)
        verbose_name = "Grupo NOC"
        verbose_name_plural = "Grupos NOC"

    def __str__(self):
        return self.noc_name


class EstadoUsuario(models.Model):
    estado_usu_name = models.CharField(max_length=100, null=False, blank=False, default="", unique=True)
    description = models.CharField(max_length=150, null=False, blank=False, default="")

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False, related_name="tbl_usuario", unique=True)    
    rol = models.ForeignKey(
        Roles,models.DO_NOTHING,
        related_name="tbl_roles", default=0
    )

    noc = models.ForeignKey(NocsGrupos, models.DO_NOTHING, related_name="tbl_nocs", null=True, blank=True)  # Cambiado a null=True y blank=True

    pais = models.ForeignKey(Pais, on_delete=models.SET_NULL, null=True, blank=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    provincia = models.ForeignKey(Provincia, on_delete=models.SET_NULL, null=True, blank=True)
    distrito = models.ForeignKey(Distrito, on_delete=models.SET_NULL, null=True, blank=True)

    localidad = models.CharField(max_length=255, null=True, blank=True, default="")  
    direccion = models.CharField(max_length=500, null=True, blank=True, default="")
    referencia = models.CharField(max_length=500, null=True, blank=True, default="")

    dni = models.CharField(max_length=10, null=True, blank=True, default="")
    correo_personal = models.CharField(max_length=10, null=True, blank=True, default="")
    num_celular = models.CharField(max_length=10, null=True, blank=True, default="")
    num_telefono = models.CharField(max_length=10, null=True, blank=True, default="")
    cargo = models.CharField(max_length=10, null=True, blank=True, default="")

    logeo = models.IntegerField(null=True, default=None)
    foto = models.TextField(null=True, blank=True,default=None)
    estado = models.ForeignKey(
        EstadoUsuario,models.DO_NOTHING,
        related_name="tbl_estado_usu", default=0
    )

    usuario_reg = models.IntegerField(null=True, blank=True,default=0)
    estado_fecha = models.DateTimeField( null=True, blank=True,default=None)
    usuario_act_estado = models.IntegerField(null=True, blank=True)
   
    eliminar_fecha = models.DateTimeField( null=True, blank=True,default=None)
    usuario_eliminar = models.IntegerField(null=True, blank=True,default=0)
    
    editar_fecha = models.DateTimeField( null=True, blank=True,default=None)
    usuario_act = models.IntegerField(null=True, blank=True,default=0)

    class Meta:
        ordering = ("pk",)

class Cursos(models.Model):
    nom_curso = models.CharField(max_length=600, null=True, blank=True, default="")
    introdu_curso = models.TextField(null=False, blank=False, default="")
    
    img_logo = models.TextField(null=True, blank=True,default=None)
    img_fondo = models.TextField(null=True, blank=True,default=None)
    vid_trailer = models.TextField(null=True, blank=True,default=None)
    vid_trailer_url = models.TextField(null=True, blank=True,default=None)

    resumen_curso = models.TextField(null=False, blank=False, default="")
    acerca_curso = models.TextField(null=False, blank=False, default="")
    sobre_autor = models.TextField(null=False, blank=False, default="")
        
    docente = models.IntegerField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class CursoUsuario(models.Model):
    usuarios = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, related_name="tbl_usuario_cu")  
    cursos = models.ForeignKey(Cursos, on_delete=models.CASCADE,null=False, blank=False, related_name="tbl_curso_cu")  

    vistas = models.IntegerField(null=False, blank=True,default=0)
    feedback_puntaje = models.IntegerField(null=False, blank=True,default=0)
    likes = models.BooleanField(null=False, blank=True,default=False)

    fecha_ultimo_acceso = models.DateTimeField(auto_now=True)

    estado_examen_curso = models.IntegerField(null=False, blank=True,default=1)
    avance_modulos = models.IntegerField(null=True, blank=True,default=None)
    avance_tema = models.IntegerField(null=True, blank=True,default=None)
    est_avance = models.IntegerField(null=False, blank=True,default=1)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class Contenidos(models.Model):
    curso = models.ForeignKey('Cursos', on_delete=models.CASCADE, related_name='tbl_contenidos')
    titulo_content = models.CharField(max_length=200)

    orden = models.IntegerField(null=True, blank=True,default=None)
    
    status = models.BooleanField(null=True, blank=True,default=None)

    avance_modulos = models.IntegerField(null=True, blank=True,default=None)


    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class Temas(models.Model):
    contenido = models.ForeignKey('Contenidos', on_delete=models.CASCADE, related_name='contenidos_temas')
    
    titulo_tema = models.CharField(max_length=200)
    resumen_tema = models.TextField()

    video_tema = models.TextField(null=True, blank=True,default=None)
    video_tema_url = models.TextField(null=True, blank=True,default=None)

    img_fondo =  models.TextField(null=True, blank=True,default=None)
    orden = models.IntegerField(null=True, blank=True,default=None)

    avance_tema = models.IntegerField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class ArchivoTemas(models.Model):
    temas = models.ForeignKey(Temas, on_delete=models.CASCADE, related_name='archivos')
    archivo =  models.TextField(null=True, blank=True,default=None)
    descripcion = models.CharField(max_length=255, blank=True)
        
    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",) 
    
class Quiz(models.Model):
    contenido = models.ForeignKey('Contenidos', on_delete=models.CASCADE, related_name='quizzes_contenido')
    titulo_quiz = models.CharField(max_length=200)
    objetivo_quiz = models.TextField(default=None)      
    tiempo_quiz = models.TimeField(default="00:00:00")
    imagen_quiz =  models.TextField(null=True, blank=True,default=None)
    video_quiz = models.TextField(null=True, blank=True,default=None)
    video_quiz_url = models.TextField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class PreguntaQuiz(models.Model):
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE, related_name='preguntas')
    pregunta =  models.TextField(null=True, blank=True,default=None)
    opcion1 = models.CharField(max_length=200)
    opcion2 = models.CharField(max_length=200)
    opcion3 = models.CharField(max_length=200, blank=True, null=True)
    opcion4 = models.CharField(max_length=200, blank=True, null=True)
    opcion5 = models.CharField(max_length=200, blank=True, null=True)
    opciones_correctas = models.CharField(max_length=200)
    imagen_pregunta = models.TextField(null=True, blank=True,default=None)
        
    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)
    
    class Meta:
        ordering = ("pk",)

class ExamenCurso(models.Model):
    curso = models.ForeignKey('Cursos', on_delete=models.CASCADE, related_name='examen_curso')
    titulo_examen = models.CharField(max_length=200)
    objetivo_examen = models.TextField(default=None)      
    tiempo_examen = models.TimeField(default="00:00:00")
    imagen_examen =  models.TextField(null=True, blank=True,default=None)
    video_examen = models.TextField(null=True, blank=True,default=None)
    video_examen_url = models.TextField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class PreguntaExamenCurso(models.Model):
    examen_curso = models.ForeignKey('ExamenCurso', on_delete=models.CASCADE, related_name='preguntas_examen_curso')
    pregunta =  models.TextField(null=True, blank=True,default=None)
    opcion1 = models.CharField(max_length=200)
    opcion2 = models.CharField(max_length=200)
    opcion3 = models.CharField(max_length=200, blank=True, null=True)
    opcion4 = models.CharField(max_length=200, blank=True, null=True)
    opcion5 = models.CharField(max_length=200, blank=True, null=True)
    opciones_correctas = models.CharField(max_length=200)
    imagen_pregunta = models.TextField(null=True, blank=True,default=None)

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)
    
    class Meta:
        ordering = ("pk",)

class NotaExamenCurso(models.Model):
    curso_usuario = models.ForeignKey(
        'CursoUsuario', 
        on_delete=models.CASCADE, 
        related_name='notas_examen_curso_usu'
    )
    examen_curso = models.ForeignKey(
        'ExamenCurso', 
        on_delete=models.CASCADE, 
        related_name='notas_examen_curso'
    )
    nota = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        default=0,
        help_text='Nota del examen. Máximo 9999.99'
    )
    status_choices = [
        (True, 'Activo'),
        (False, 'Inactivo'),
        (None, 'Desconocido'),
    ]
    status = models.BooleanField(
        null=True, 
        blank=True, 
        choices=status_choices,
        default=None,
        help_text='Estado del registro'
    )
    usuario_reg = models.IntegerField(
        null=True, 
        blank=True, 
        default=None,
        help_text='Usuario que registró el objeto'
    )
    creado = models.DateTimeField(
        auto_now_add=True, 
        null=True, 
        blank=True,
        help_text='Fecha y hora de creación del objeto'
    )
    usuario_act = models.IntegerField(
        null=True, 
        blank=True, 
        default=None,
        help_text='Usuario que actualizó el objeto'
    )
    editado = models.DateTimeField(
        null=True, 
        blank=True, 
        default=None,
        help_text='Fecha y hora de la última actualización'
    )
    usuario_elim = models.IntegerField(
        null=True, 
        blank=True, 
        default=None,
        help_text='Usuario que eliminó el objeto'
    )
    eliminado = models.DateTimeField(
        null=True, 
        blank=True, 
        default=None,
        help_text='Fecha y hora de eliminación del objeto'
    )

    class Meta:
        ordering = ("-creado",)

    def __str__(self):
        return f"NotaExamenCurso {self.pk}: {self.curso_usuario} - {self.examen_curso}"

class RespuestaUsuarioExamen(models.Model):
    nota_examen = models.ForeignKey(NotaExamenCurso, on_delete=models.CASCADE, related_name='respuestas_usuario_examen')
    pregunta_examen = models.ForeignKey(PreguntaExamenCurso, on_delete=models.CASCADE, related_name='respuestas_usuario_examen')
    opcion_marcada = models.CharField(max_length=200)  # Campo para almacenar la opción marcada por el usuario

    status = models.BooleanField(null=True, blank=True, default=None)

    usuario_reg = models.IntegerField(null=True, blank=True, default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True, default=None)
    editado = models.DateTimeField(null=True, blank=True, default=None)

    usuario_elim = models.IntegerField(null=True, blank=True, default=None)
    eliminado = models.DateTimeField(null=True, blank=True, default=None)

    class Meta:
        ordering = ("pk",)











class Secciones(models.Model):

    menu =  models.IntegerField(null=True, blank=True,default=None)
    submenu =  models.IntegerField(null=True, blank=True,default=None)
    submenufinal =  models.IntegerField(null=True, blank=True,default=None)
    id_padre =  models.IntegerField(null=True, blank=True,default=None)
    
    nombre = models.CharField(max_length=100, null=True, blank=True, default="")
    descrip = models.TextField(null=False, blank=False, default="")

    status = models.BooleanField(null=True, blank=True,default=None)

    usuario_reg = models.IntegerField(null=True, blank=True,default=None)
    creado = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    usuario_act = models.IntegerField(null=True, blank=True,default=None)
    editado = models.DateTimeField(null=True, blank=True,default=None)

    usuario_elim = models.IntegerField(null=True, blank=True,default=None)
    eliminado = models.DateTimeField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class SeccionesRoles(models.Model):
    seccion = models.IntegerField(null=True, blank=True,default=None)
    role = models.IntegerField(null=True, blank=True,default=None)
    detalle = models.IntegerField(null=True, blank=True,default=None)
    editor = models.IntegerField(null=True, blank=True,default=None)
    visualizador = models.IntegerField(null=True, blank=True,default=None)
    eliminador = models.IntegerField(null=True, blank=True,default=None)

    status_selec = models.BooleanField(null=True, blank=True,default=None)
    status = models.BooleanField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class MenusRoles(models.Model):
    menus = models.IntegerField(null=True, blank=True,default=None)
    role = models.IntegerField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class SubMenusRoles(models.Model):
    submenus = models.IntegerField(null=True, blank=True,default=None)
    role = models.IntegerField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)

class SubMenusFinalesRoles(models.Model):
    submenusfinales = models.IntegerField(null=True, blank=True,default=None)
    role = models.IntegerField(null=True, blank=True,default=None)

    class Meta:
        ordering = ("pk",)


# //--------------------------Linea de Tiempo
# Tabla Cabecera
class LineaTiempo(models.Model):
    codigo_ticket = models.CharField(max_length=100, unique=True)  # Ajustamos a 100 caracteres y lo hacemos único
    fecha_incidencia = models.DateTimeField(auto_now_add=True)  # No se necesita null=True, blank=True si auto_now_add=True
    titulo_incidencia = models.CharField(max_length=255)  # Reducimos el tamaño para optimizar
    descrip_incidencia = models.TextField()  # TextField en lugar de CharField para descripciones largas

    status = models.BooleanField(default=True)  # Booleano que no necesita null=True

    usuario_reg = models.IntegerField(null=True, blank=True)  # Conservamos la opción de dejar en blanco
    creado = models.DateTimeField(auto_now_add=True)

    usuario_act = models.IntegerField(null=True, blank=True)
    editado = models.DateTimeField(auto_now=True, null=True, blank=True)  # auto_now=True para marcar ediciones automáticamente

    usuario_elim = models.IntegerField(null=True, blank=True)
    eliminado = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("pk",)
        # db_table = 'linea_tiempo'  # Definimos un nombre claro para la tabla

# Tabla Detalle
class LineaTiempoEvento(models.Model):
    linea_tiempo = models.ForeignKey(LineaTiempo, on_delete=models.CASCADE, related_name="eventos")  # Clave foránea a LineaTiempo
    fecha_evento = models.DateTimeField(auto_now_add=True)
    descrip_evento = models.TextField()  # TextField para descripciones largas
    noc = models.IntegerField()  # Dejamos noc sin permitir null

    estado = models.IntegerField()  # Dejamos estado sin permitir null

    status = models.BooleanField(default=True)

    usuario_reg = models.IntegerField(null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    usuario_act = models.IntegerField(null=True, blank=True)
    editado = models.DateTimeField(auto_now=True, null=True, blank=True)

    usuario_elim = models.IntegerField(null=True, blank=True)
    eliminado = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("pk",)
        # db_table = 'linea_tiempo_evento'  # Definimos un nombre claro para la tabla