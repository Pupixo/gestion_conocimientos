from collections import Counter
from django.http import JsonResponse


# def calcular_porcentajes(obtener_notas, propiedades):
#     # Inicializamos un diccionario para almacenar los porcentajes
#     porcentajes = {prop: 0 for prop in propiedades}

#     # Calculamos el total de notas
#     total_notas = sum(obtener_notas.values())
    
#     # Calculamos el porcentaje para cada nota presente en obtener_notas
#     for nota, cantidad in obtener_notas.items():
#         if nota in propiedades:
#             porcentajes[nota] = (cantidad / total_notas) * 100
    
#     return porcentajes

def calcular_notas_porcentajes_con_cantidad(obtener_notas, propiedades):
    # Inicializamos un diccionario para almacenar los porcentajes y las cantidades
    porcentajes_con_cantidad = {prop: (0.0, 0) for prop in propiedades}

    # Calculamos el total de notas
    total_notas = sum(obtener_notas.values())
    
    # Calculamos el porcentaje y añadimos la cantidad para cada nota presente en obtener_notas
    for nota, cantidad in obtener_notas.items():
        if nota in propiedades:
            porcentaje = (cantidad / total_notas) * 100
            porcentajes_con_cantidad[nota] = (porcentaje, cantidad)
    
    return porcentajes_con_cantidad


def contar_repeticiones_notas(desempenio_data):
    desempenio_data = [str(nota) for nota in desempenio_data]
    contador = Counter(desempenio_data)

    obtener_notas = dict(contador)
    print("obtener_notas.................",obtener_notas)
    propiedades = ['0', '4', '8', '12', '16', '20']
    porcentajes = calcular_notas_porcentajes_con_cantidad(obtener_notas, propiedades)

    return porcentajes


def contar_desempenio(desempenio,examen_no_tomado_data):
    aprobados = len([nota for nota in desempenio if nota > 10])
    desaprobados = len([nota for nota in desempenio if nota <= 10])
    no_evaluados = sum(examen_no_tomado_data)
    return {'aprobados': aprobados, 'desaprobados': desaprobados,'no_evaluados':no_evaluados}


def contar_participacion(data_activos):

    print("data_activos.............................",data_activos)
    total = len(data_activos)


    terminados = (data_activos.count(3) /total)*100
    avanzando = (data_activos.count(1)/total)*100
    ausentes = (data_activos.count(0)/total)*100


    return {'terminados': terminados, 'avanzando': avanzando, 'ausentes': ausentes}


def get_video_duration(video):
    video_url = video
    # if not video_url:
    #     return JsonResponse({'error': 'No video URL provided'}, status=400)
    
    # try:
    #     clip = VideoFileClip(video_url)
    #     duration = clip.duration
    #     return JsonResponse({'duration': duration})
    # except Exception as e:
    #     return JsonResponse({'error': str(e)}, status=500)