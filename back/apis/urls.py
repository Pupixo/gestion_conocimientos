from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path
from apis.views import Usuarios, UsuariosInfo, UsuariosPassword,UsuariosIndividual,UsuariosIndividualDatos,RolAnalisis,SeccionAnalisis,estadoUsuarioAnalisis
from apis.views import SeccionRolesAnalisis,UsuariosIndividualFoto
from apis.views import BusquedaArchivo,RutasArchivo,CrearCarpetas,CrearArchivo,EliminoArchivo
from .views import CustomTokenObtainPairView
from apis.views import  CursosTblViewSet,ContenidoTblViewSet,TemasTblViewSet,ArchivoTemasTblViewSet,QuizTblViewSet,PreguntasTblViewSet,CursoUsuarioTblViewSet,ExamenCursoViewSet,PreguntasExamenCursoViewSet,NotasExamenViewSet,CursoEstadisticaTblViewSet

from apis.views import ReporteC7,LineaTiempoViewSet,LineaTiempoEventoViewSet

from apis.views import ChatbootViewSet

from apis.views import PaisesViewSet,DepartamentoViewSet,ProvinciaViewSet,DistritoViewSet
from apis.views import NocsGruposViewSet

router = routers.SimpleRouter()

urlpatterns = router.urls

urlpatterns += [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Usuarios
    path('usuarios/', Usuarios.as_view(), name='api-usuarios'),
    path('usuarios/<int:pk>/', Usuarios.as_view(), name='api-usuarios-id'),
    path('usuarios-password/<int:pk>/', UsuariosPassword.as_view(), name='api-usuarios-password-id'),

    ## Usuario Info
    path('usuarios/usuario-data/', UsuariosInfo.as_view(), name='api-usuario-me'),
    path('usuarios/registro-individual-foto/', UsuariosIndividualFoto.as_view(), name='api-usuarios-individual-foto'),
    path('usuarios/registro-individual-datos/', UsuariosIndividualDatos.as_view(), name='api-usuarios-individual-datos'),

    ## Localidades
    path('paises/', PaisesViewSet.as_view({'get': 'list', 'post': 'create'}), name='paises-list'),
    path('departamentos/<str:type>/<str:id>/', DepartamentoViewSet.as_view({'get': 'list_by_type'}), name='departamentos-list'),
    path('provincias/<str:type>/<str:id>/', ProvinciaViewSet.as_view({'get': 'list_by_type'}), name='provincias-list'),
    path('distritos/<str:type>/<str:id>/', DistritoViewSet.as_view({'get': 'list_by_type'}), name='distritos-list'),
    path('nocsgrupos/', NocsGruposViewSet.as_view({'get': 'list', 'post': 'create'}), name='nocsgrupos-list'),

    # Roles
    path('rol/', RolAnalisis.as_view(), name='api-rol'),
    path('rol/<int:pk>/', RolAnalisis.as_view(), name='api-rol-id'),

    # Estado
    path('estado-usuario/', estadoUsuarioAnalisis.as_view(), name='api-est-usuario'),

    # Secciones
    path('secciones/', SeccionAnalisis.as_view(), name='api-rol'),
    path('secciones/<int:pk>/', SeccionAnalisis.as_view(), name='api-rol-id'),

    # SeccionesRoles
    path('secciones-roles/', SeccionRolesAnalisis.as_view(), name='api-rol'),
    path('secciones-roles/<int:pk>/', SeccionRolesAnalisis.as_view(), name='api-rol-id'),

    path('buscar-archivo/search/<str:query>/', BusquedaArchivo.as_view(), name='search_files'),
    path('buscar-archivo/search/', BusquedaArchivo.as_view(), name='search_files'),

    # RutasFiles
    path('ruta-archivo/', RutasArchivo.as_view(), name='ruta_archivos'),
    path('ruta-archivo/<str:pk>/', RutasArchivo.as_view(), name='ruta_archivos_id'),

    path('ruta-archivo/crear_carpeta', CrearCarpetas.as_view(), name='crear-carpeta'),
    path('ruta-archivo/crear_archivo', CrearArchivo.as_view(), name='crear-archivo'),
    path('ruta-archivo/eliminar_archivo', EliminoArchivo.as_view(), name='eliminar-archivo'),



    # SeccionesRoles
    # path('converttopdf/', SeccionRolesAnalisis.as_view(), name='api-rol'),

    ###############################################################################################################################################################################
    ###############################################################################################################################################################################

    # cursos
    path('gestion_curso/', CursosTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_curso'),

    # Rutas para editar y eliminar cursos
    path('gestion_curso/<int:pk>/', CursosTblViewSet.as_view({'put': 'update'}), name='editar_curso'),
    path('eliminar-curso/<int:pk>/', CursosTblViewSet.as_view({'delete': 'destroy'}), name='eliminar_curso'),

    #contenido
    path('gestion_curso/contenido-curso/', ContenidoTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_curso_contenido'),
    path('gestion_curso/contenido-curso-id/<int:pk>/', ContenidoTblViewSet.as_view({'get': 'retrieve'}), name='id_contenido'),
    path('gestion_curso/contenido-curso-update/<int:pk>/', ContenidoTblViewSet.as_view({'put': 'update'}), name='editar_curso_contenido'),
    path('gestion_curso/contenido-curso/<int:pk>/', ContenidoTblViewSet.as_view({'get': 'list_by_curso'}), name='detalle_curso_contenido'),
    path('gestion_curso/contenido-curso/<int:pk>/', ContenidoTblViewSet.as_view({'delete': 'delete'}), name='delete_eliminar '),

   # archivo contenido
    path('gestion_curso/archivo-tema/<str:type>/<int:id>/', ArchivoTemasTblViewSet.as_view({'get': 'list_by_type'}), name='detalle_contenido'),
    path('gestion_curso/archivo-tema/<int:id_archivo_tema>/', ArchivoTemasTblViewSet.as_view({'delete': 'destroy'})),

    #temas
    path('gestion_curso/contenido-tema/', TemasTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='list_create_temas'),
    path('gestion_curso/contenido-tema/<str:type>/<int:id>/', TemasTblViewSet.as_view({'get': 'list_by_type'}), name='tipo_id'),
    path('gestion_curso/contenido-tema/<int:pk>/', TemasTblViewSet.as_view({'put': 'update'}), name='update_temas'),
    path('gestion_curso/contenido-tema/<int:pk>', TemasTblViewSet.as_view({'delete': 'delete'}), name='delete_temas'),

    #quiz
    path('gestion_curso/quiz/', QuizTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='process_quiz'),
    path('gestion_curso/quiz/<str:type>/<int:id>/', QuizTblViewSet.as_view({'get': 'list_by_type'}), name='ids_tipo_quiz'),
    path('gestion_curso/quiz/<int:pk>/', QuizTblViewSet.as_view({'put': 'update'}), name='update_quiz'),
    path('gestion_curso/quiz/<int:id>', QuizTblViewSet.as_view({'delete': 'destroy'}), name='eliminar_quiz'),

    #preguntas
    path('gestion_curso/preguntas/', PreguntasTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_crear_preguntas'),
    path('gestion_curso/preguntas/<str:type>/<int:id>/', PreguntasTblViewSet.as_view({'get': 'list_by_type'}), name='ids_tipo_preguntas'),
    path('gestion_curso/preguntas/<int:pk>/', PreguntasTblViewSet.as_view({'put': 'update'}), name='update_preguntas'),  
    path('gestion_curso/preguntas/<int:id>', PreguntasTblViewSet.as_view({'delete': 'destroy'}), name='eliminar_preguntasz'),

    #examen_curso
    path('gestion_curso/examen_curso/', ExamenCursoViewSet.as_view({'get': 'list', 'post': 'create'}), name='process_examen_curso'),
    path('gestion_curso/examen_curso/<str:type>/<int:id>/', ExamenCursoViewSet.as_view({'get': 'list_by_type'}), name='ids_tipo_examen_curso'),
    path('gestion_curso/examen_curso/<int:pk>/', ExamenCursoViewSet.as_view({'put': 'update'}), name='update_examen_curso'),
    path('gestion_curso/examen_curso/<int:id>', ExamenCursoViewSet.as_view({'delete': 'destroy'}), name='eliminar_examen_curso'),

    #preguntas examen
    path('gestion_curso/preguntas-examen-curso/', PreguntasExamenCursoViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_crear_preguntas_examen_curso'),
    path('gestion_curso/preguntas-examen-curso/<str:type>/<int:id>/', PreguntasExamenCursoViewSet.as_view({'get': 'list_by_type'}), name='ids_tipr_preguntas_examen_curso'),
    path('gestion_curso/preguntas-examen-curso/<int:pk>/', PreguntasExamenCursoViewSet.as_view({'put': 'update'}), name='updatr_preguntas_examen_curso'),  
    path('gestion_curso/preguntas-examen-curso/<int:id>', PreguntasExamenCursoViewSet.as_view({'delete': 'destroy'}), name='eliminar_preguntas_examen_cursoz'),

    # nota examen 
    path('gestion_curso/notas_examen/', NotasExamenViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_crear_notas_examen'),
    path('gestion_curso/notas_examen/<str:type>/<int:id>/', NotasExamenViewSet.as_view({'get': 'list_by_type'}), name='ids_tipr_notas_examen'),
    path('gestion_curso/notas_examen/<int:pk>/', NotasExamenViewSet.as_view({'put': 'update'}), name='update_notas_examen'),  
    path('gestion_curso/notas_examen/<int:id>', NotasExamenViewSet.as_view({'delete': 'destroy'}), name='eliminar_notas_examen'),

    #curso usuario
    path('gestion_curso/curso_usuario/<str:type>/<str:id>/', CursoUsuarioTblViewSet.as_view({'get': 'list_by_type'}), name='ids_tipo_cursousu'),
    path('gestion_curso/curso_usuario/', CursoUsuarioTblViewSet.as_view({'post': 'registrar_acciones'}), name='process_registro_curso_usu'),
    path('gestion_curso/curso_usuario/<int:pk>/', CursoUsuarioTblViewSet.as_view({'put': 'actualizar_acciones'}), name='process_update_curso_usu'),
    path('gestion_curso/_id/<int:pk>/<int:usu>/', CursoUsuarioTblViewSet.as_view({'get': 'retrieve'}), name='listaporid_curso'),


    #curso usuario estadistica
    path('gestion_curso/estadistica_resumen/', CursoEstadisticaTblViewSet.as_view({'get': 'list', 'post': 'create'}), name='listar_crear_notas_examen'),
    path('gestion_curso/estadistica_resumen/<str:type>/<str:id>/', CursoEstadisticaTblViewSet.as_view({'get': 'list_by_type'}), name='ids_tipo_cursousu'),
    path('gestion_curso/estadistica_resumen/<int:pk>/', CursoEstadisticaTblViewSet.as_view({'get': 'list_id'}), name='id_estadistica_curso'),

    #linea tiempo
    path('linea_tiempo/', LineaTiempoViewSet.as_view({'get': 'list', 'post': 'create'}), name='linea_tiempo_get_create'),
    path('linea_tiempo/<int:pk>/', LineaTiempoViewSet.as_view({'put': 'update','delete': 'delete'}), name='linea_tiempo_update'),
    path('linea_tiempo/<str:type>/<str:id>/', LineaTiempoViewSet.as_view({'get': 'list_by_type'}), name='linea_tiempo_list_by_type'),
        
    path('linea_tiempo/evento/', LineaTiempoEventoViewSet.as_view({'get': 'list', 'post': 'create'}), name='linea_tiempo_evento_get_create'),
    path('linea_tiempo/evento/<int:pk>/', LineaTiempoEventoViewSet.as_view({'put': 'update','delete': 'delete'}), name='linea_tiempo_evento_update'),
    path('linea_tiempo/evento/<str:type>/<str:id>/', LineaTiempoEventoViewSet.as_view({'get': 'list_by_type'}), name='linea_tiempo_evento_list_by_type'),

    ###############################################################################################################################################################################
    ###############################################################################################################################################################################

    #reporte excel
    path('reportes_excel/', ReporteC7.as_view({'get': 'list', 'post': 'create'}), name='ids_tipo_cursousu'),
    path('reportes_excel/<int:pk>/', ReporteC7.as_view({'put': 'update'}), name='update_reporte_eliminar'),

    #boot
    path('chatbot/mensaje_usu/', ChatbootViewSet.as_view({'get': 'list', 'post': 'enviar_mensaje_usu'}), name='chatbot_mensaje_usu'),



]