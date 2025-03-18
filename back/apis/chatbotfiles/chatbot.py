def get_bot_response(message, bot_last_message):
    respuesta = {}
    
    if bot_last_message in ("Ingresa tu codigo C# y E#",):
        respuesta = {
            'lista_respuestas': ["Bienvenido usuario de claro", "Escribe tus nombres y apellidos"],
            'tipo_respuesta': 'lineal',
            'mensaje_principal': False
        }
    elif bot_last_message in ("Escribe tus nombres y apellidos.",):
        respuesta = {
            'lista_respuestas': ['Directores', 'subdirectores', 'Gerentes', 'Jefes y Supervisores'],
            'tipo_respuesta': 'opcional_unica',
            'mensaje_principal': 'Escoge una de las opciones'
        }
    elif bot_last_message in ("Escoge una de las opciones",):
        respuesta = {
            'lista_respuestas': [
                "validación correcta",
                "link de grupo de whatsapp",
                "https://chat.whatsapp.com/CzFk1rlJtodLPhe14HQjm1",
                "ingresa a tu grupo"
            ],
            'tipo_respuesta': 'lineal',
            'mensaje_principal': False
        }
    elif bot_last_message in ("ingresa a tu grupo",):
        respuesta = {
            'lista_respuestas': ["validación finalizada"],
            'tipo_respuesta': 'final',
            'mensaje_principal': False
        }
    else:
        respuesta = {
            'error': "No se ha podido procesar el mensaje."
        }
    
    return respuesta
