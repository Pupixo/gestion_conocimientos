from rest_framework import serializers
from rest_framework.response import Response

from django.contrib.auth.models import User
# Modelos Aqui
from apis.models import PerfilUsuario,EstadoUsuario,Roles,Secciones
from apis.models import SeccionesRoles
from apis.models import Pais,Departamento,Provincia,Distrito
from apis.models import NocsGrupos

from apis.models import LineaTiempo,LineaTiempoEvento

from apis.models import Cursos, CursoUsuario, Contenidos, Temas, ArchivoTemas ,Quiz , PreguntaQuiz ,ExamenCurso ,PreguntaExamenCurso,NotaExamenCurso,RespuestaUsuarioExamen
from apis.utils.performance_utils import contar_desempenio,contar_participacion,contar_repeticiones_notas,get_video_duration


class UserSerializer(serializers.ModelSerializer):
    perfil_data = serializers.SerializerMethodField('get_perfil_data')

    class Meta:
        model = User
        fields = "__all__"

    def get_perfil_data(self, obj):
        try:
            customer = PerfilUsuario.objects.get(user_id=obj.id)
            data =  {'foto':customer.foto,'id': customer.id, 'estado': customer.estado.id,  'estado_nom':customer.estado.estado_usu_name , 'rol': customer.rol.id , 'rol_name': customer.rol.role_name }
            return data
        except PerfilUsuario.DoesNotExist:
            return  {'foto':None,'id': 0, 'estado': 0, 'estado_nom':'' ,'rol': 0, 'rol_name':''}

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField('get_analistaasignadodata')
    rol_data= serializers.SerializerMethodField('get_roldata')
    class Meta:
        model = PerfilUsuario
        fields = "__all__"

    def get_analistaasignadodata(self,obj):
        customer = User.objects.get(pk=obj.user.id)
        # Obtener los campos del modelo
        fields = customer._meta.fields
        lista_datos= []
        datos = {}

        for field in fields:
            if field.name != 'password':
                value = getattr(customer, field.name)
                datos[field.name] = value

        lista_datos.append(datos)
        return lista_datos

    def get_roldata(self,obj):
        customer = Roles.objects.get(pk=obj.rol.id)
        # Obtener los campos del modelo
        fields = customer._meta.fields
        lista_datos= []
        datos = {}

        for field in fields:
            value = getattr(customer, field.name)
            datos[field.name] = value

        lista_datos.append(datos)
        return lista_datos

class UserInforSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ['id', 'nombre', 'codigopais']

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'nombre', 'pais']

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ['id', 'nombre', 'departamento']

class DistritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distrito
        fields = ['id', 'nombre', 'provincia','departamento']

class NocsGruposSerializer(serializers.ModelSerializer):
    class Meta:
        model = NocsGrupos
        fields = ['noc_name', 'description', 'acronimo']

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = "__all__"

class EstadoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoUsuario
        fields = "__all__"


class SeccionesSerializer(serializers.ModelSerializer):
    padre_id_data = serializers.SerializerMethodField('get_detalle')

    class Meta:
        model = Secciones
        fields = "__all__"

    def get_detalle(self,obj):

        secciones = Secciones.objects.filter(id_padre=obj.id)
        datos = {'detalle':secciones.count()}
        return datos



###############################################################################################################################################################################
###############################################################################################################################################################################
#cursos

class SeccionesRolesSerializer(serializers.ModelSerializer):
    padre_id_data = serializers.SerializerMethodField('get_detalle')

    class Meta:
        model = SeccionesRoles
        fields = "__all__"

    def get_detalle(self,obj):
        secciones = Secciones.objects.get(id=obj.seccion)
        secciones_sec = Secciones.objects.filter(id_padre=obj.seccion)
        datos = {'detalle':secciones_sec.count(),'nombre':secciones.nombre,'id_seccion':secciones.id}
        return datos


##################################################################################################################################################################333
##################################################################################################################################################################333


class CursoUsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = CursoUsuario
        fields = '__all__'

class ArchivoTemasSerializer(serializers.ModelSerializer):

    class Meta:
        model = ArchivoTemas
        fields = ['id', 'temas', 'archivo', 'descripcion']

class TemasSerializer(serializers.ModelSerializer):
    archivos = ArchivoTemasSerializer(many=True, read_only=True)
    analisis_video= serializers.SerializerMethodField()

    class Meta:
        model = Temas
        fields = '__all__'

    def get_analisis_video(self, obj):
        print("sss")
        return get_video_duration(obj.video_tema)

class PreguntaQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaQuiz
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    preguntas_data = PreguntaQuizSerializer(many=True, read_only=True , source='preguntas')
    class Meta:
        model = Quiz
        fields = '__all__'

class ContenidoSerializer(serializers.ModelSerializer):
    temas = TemasSerializer(many=True, read_only=True , source='contenidos_temas')
    quiz = QuizSerializer(many=True, read_only=True , source='quizzes_contenido')
    class Meta:
        model = Contenidos
        fields = '__all__'

class PreguntasExamenCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaExamenCurso
        fields = '__all__'

class ExamenCursoSerializer(serializers.ModelSerializer):

    preguntas_data = PreguntasExamenCursoSerializer(many=True, read_only=True, source='preguntas_examen_curso')
    curso_data = serializers.SerializerMethodField()
    curso_usuario_data = serializers.SerializerMethodField()

    class Meta:
        model = ExamenCurso
        fields = '__all__'

    def get_curso_data(self, obj):
        # Obtener datos del curso relacionado
        curso = obj.curso
        return {
            "id_curso": curso.id,
            "status_curso": curso.status
            # Agregar más campos si es necesario
        }

    def get_curso_usuario_data(self, obj):
        curso_usuario = CursoUsuario.objects.filter(cursos=obj.curso).first()
        if curso_usuario:
            return CursoUsuarioSerializer(curso_usuario).data
        return None


# cursos
class CursosSerializer(serializers.ModelSerializer):
    docente_data = serializers.SerializerMethodField('get_docentedata')
    cursousuarios = serializers.SerializerMethodField()
    # cursousuarios = CursoUsuarioSerializer(many=True, read_only=True, source='tbl_curso_cu')
    # contenidos_data = ContenidoSerializer(many=True, read_only=True, source='tbl_contenidos')
    # contenidos = ContenidoSerializer(many=True, read_only=True)
    contenidos_data = serializers.SerializerMethodField()
    examen_final = serializers.SerializerMethodField()

    class Meta:
        model = Cursos
        fields = '__all__'

    def get_docentedata(self,obj):
        print("obj....get_docentedata............",obj)
        usu_id = self.context.get('usu')
        print("usu....get_docentedata............",usu_id)
        # Check if the docente field is not None
        if obj.docente is not None:
            try:
                # usuario = User.objects.get(pk=obj.docente)
                usuario = User.objects.get(pk=obj.docente)
                print("Docente data:", usuario)
                # Obtener los campos del modelo
                fields = usuario._meta.fields
                lista_datos= []
                datos = {}
                for field in fields:
                    if field.name != 'password' and field.name != 'id' :
                        value = getattr(usuario, field.name)
                        datos[field.name] = value
                # lista_datos.append(datos)
                try:
                    customer = PerfilUsuario.objects.get(user_id=obj.docente)
                    datos['perfil'] =  {'foto':customer.foto,'id': customer.id, 'estado': customer.estado.id,  'estado_nom':customer.estado.estado_usu_name , 'rol': customer.rol.id , 'rol_name': customer.rol.role_name }
                    lista_datos.append(datos)
                    return lista_datos
                except PerfilUsuario.DoesNotExist:
                    datos['perfil'] =  {'foto':None,'id': 0, 'estado': 0, 'estado_nom':'' ,'rol': 0, 'rol_name':''}
                    lista_datos.append(datos)
                    return lista_datos
            except User.DoesNotExist:
                print(f"User with pk {obj.docente} does not exist.")
        else:
            print("The docente field is None for object:", obj)


    def get_contenidos_data(self, obj):
        print("obj..get_contenidos_data.",obj)
        # for query in obj:
        # Filtrar los contenidos por status=True
        contenidos_activos = obj.tbl_contenidos.filter(status=True)
        return ContenidoSerializer(contenidos_activos, many=True).data

    def get_examen_final(self, obj):
        # Filtrar los contenidos por status=True
        # for query in obj:
        contenidos_activos = obj.examen_curso.filter(status=True)
        return ExamenCursoSerializer(contenidos_activos, many=True).data

    def get_cursousuarios(self, obj):
        # for query in obj:
        curso_usuarios = obj.tbl_curso_cu.filter(status=True)  # Filtrar por clave primaria del curso
        return CursoUsuarioSerializer(curso_usuarios, many=True, read_only=True).data




# cursos usu
class CursosMainSerializer(serializers.ModelSerializer):
    docente_data = serializers.SerializerMethodField('get_docentedata')
    contenidos_data = serializers.SerializerMethodField()
    examen_final = serializers.SerializerMethodField()

    class Meta:
        model = Cursos
        fields = '__all__'

    def get_docentedata(self,obj):
        print("obj................",obj)
        try:
            usuario = User.objects.get(pk=obj.docente)
            # Obtener los campos del modelo
            fields = usuario._meta.fields
            lista_datos= []
            datos = {}
            for field in fields:
                if field.name != 'password' and field.name != 'id' :
                    value = getattr(usuario, field.name)
                    datos[field.name] = value
            # lista_datos.append(datos)

            try:
                customer = PerfilUsuario.objects.get(user_id=obj.docente)
                datos['perfil'] =  {'foto':customer.foto,'id': customer.id, 'estado': customer.estado.id,  'estado_nom':customer.estado.estado_usu_name , 'rol': customer.rol.id , 'rol_name': customer.rol.role_name }
                lista_datos.append(datos)
                return lista_datos
            except PerfilUsuario.DoesNotExist:
                datos['perfil'] =  {'foto':None,'id': 0, 'estado': 0, 'estado_nom':'' ,'rol': 0, 'rol_name':''}
                lista_datos.append(datos)
                return lista_datos

        except PerfilUsuario.DoesNotExist:
            return  []

    def get_contenidos_data(self, obj):
        print("obj..get_contenidos_data.",obj)
        contenidos_activos = obj.tbl_contenidos.filter(status=True)
        return ContenidoSerializer(contenidos_activos, many=True).data

    def get_examen_final(self, obj):
        print("obj..get_examen_final.",obj)
        contenidos_activos = obj.examen_curso.filter(status=True)
        return ExamenCursoSerializer(contenidos_activos, many=True).data

class CursoUsuarioMainSerializer(serializers.ModelSerializer):
    cursos = CursosMainSerializer()
    calificacion_exam_curso_data = serializers.SerializerMethodField()

    class Meta:
        model = CursoUsuario
        fields = '__all__'

    def get_calificacion_exam_curso_data(self, obj):
        examen = ExamenCurso.objects.filter(curso=obj.cursos.id).first()
        print("examen.................", examen)

        if examen is None:
            return []  # Return an empty list if there is no exam

        calificacion_exam_curso = NotaExamenCurso.objects.filter(curso_usuario=obj.id, examen_curso=examen.id)
        return NotaExamenCursoSerializer(calificacion_exam_curso, many=True).data



class RespuestaUsuarioExamenSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaUsuarioExamen
        fields = '__all__'

class NotaExamenCursoSerializer(serializers.ModelSerializer):
    respuestas_usuario_examen = RespuestaUsuarioExamenSerializer(many=True, read_only=True)
    class Meta:
        model = NotaExamenCurso
        fields = '__all__'

class CursoEstadisticaSerializer(serializers.ModelSerializer):
    desempenio = serializers.SerializerMethodField()
    participacion = serializers.SerializerMethodField()
    obtener_notas = serializers.SerializerMethodField()
    total_avance= serializers.SerializerMethodField()
    cantidad_alumnos= serializers.SerializerMethodField()
    class Meta:
        model = Cursos
        fields = '__all__'

    def get_desempenio(self, obj):
        data_activos = obj.tbl_curso_cu.filter(status=True)
        desempenio_data = []
        examen_no_tomado_data = []

        for curso_usuario in data_activos:
            calific_examen_curso = NotaExamenCurso.objects.filter(curso_usuario=curso_usuario.id).values_list('nota', flat=True)
            desempenio_data.extend([int(nota) for nota in calific_examen_curso])  # Convertir a int
            if int(curso_usuario.estado_examen_curso) == 2 or int(curso_usuario.estado_examen_curso) == 1:
                examen_no_tomado_data.append(1)

        return contar_desempenio(desempenio_data,examen_no_tomado_data)

    def get_participacion(self, obj):
        # data_activos = obj.tbl_curso_cu.all().values_list('estado_examen_curso', flat=True)
        data_activos = obj.tbl_curso_cu.filter(status=True).values_list('est_avance', flat=True)
        participacion_data = contar_participacion(list(data_activos))
        return participacion_data

    def get_obtener_notas(self, obj):
        # data_activos = obj.examen_curso.filter(status=True)
        data_activos = obj.examen_curso.all()
        desempenio_data = []
        for examen in data_activos:
            calific_examen_curso = NotaExamenCurso.objects.filter(examen_curso=examen.id).values_list('nota', flat=True)
            desempenio_data.extend([int(nota) for nota in calific_examen_curso])  # Convertir a int

        print("desempenio_data..................",desempenio_data)
        return contar_repeticiones_notas(desempenio_data)

    def get_total_avance(self, obj):
        total = obj.tbl_curso_cu.filter(status=True).count()
        print("total...................", total)
        alumnos_finalizados = obj.tbl_curso_cu.filter(status=True, est_avance=3).count()
        print("alumnos_finalizados...................", alumnos_finalizados)
        avance_total=0
        # Avoid division by zero
        if total > 0:
            avance_total = (alumnos_finalizados / total) * 100
        else:
            avance_total = 0
        return {'avance_total': avance_total}

    def get_cantidad_alumnos(self, obj):
        total = obj.tbl_curso_cu.filter(status=True).count()
        print("total...................", total)
        return {'total_alumnos': total}


# # # -----------------------linea de tiempo------------------


class LineaTiempoSerializer(serializers.ModelSerializer):

    class Meta:
        model = LineaTiempo
        fields = '__all__'



class LineaTiempoEventoSerializer(serializers.ModelSerializer):

    class Meta:
        model = LineaTiempoEvento
        fields = '__all__'
