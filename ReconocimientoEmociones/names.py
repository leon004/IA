import os
import glob

def renombrar_imagenes(ruta):
    # Verificar si la ruta existe
    if not os.path.exists(ruta):
        print(f"La ruta {ruta} no existe.")
        return

    # Buscar todas las imágenes en la ruta (considerando las extensiones más comunes)
    imagenes = glob.glob(os.path.join(ruta, "*.png")) + \
               glob.glob(os.path.join(ruta, "*.jpg")) + \
               glob.glob(os.path.join(ruta, "*.jpeg")) + \
               glob.glob(os.path.join(ruta, "*.bmp")) + \
               glob.glob(os.path.join(ruta, "*.gif"))

    if not imagenes:
        print(f"No se encontraron imágenes en la ruta {ruta}.")
        return

    # Renombrar cada imagen
    for i, imagen in enumerate(imagenes):
        # Obtener la extensión del archivo
        extension = os.path.splitext(imagen)[1]
        # Crear el nuevo nombre
        nuevo_nombre = f"LeoCSorpresa{i}{extension}" #aqui colocar el nombre deseado de las imagenes
        # Obtener la ruta completa del nuevo nombre
        nueva_ruta = os.path.join(ruta, nuevo_nombre)
        # Renombrar el archivo
        os.rename(imagen, nueva_ruta)
        print(f"Renombrado: {imagen} -> {nueva_ruta}")

    print("Renombrado completado.")

# Forma de usar
ruta_imagenes = "C:\\Users\\lcald\\OneDrive\\Documentos\\ia\\LeoCSorpresa"
renombrar_imagenes(ruta_imagenes)
