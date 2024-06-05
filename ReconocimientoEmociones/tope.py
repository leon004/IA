import os
import glob

def eliminar_imagenes(ruta, limite=300):
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

    # Ordenar las imágenes por fecha de creación
    imagenes.sort(key=os.path.getctime)

    # Eliminar imágenes después del límite
    for i, imagen in enumerate(imagenes):
        if i >= limite:
            os.remove(imagen)
            print(f"Eliminado: {imagen}")

    print(f"Proceso completado. Imágenes totales: {len(imagenes)}, Imágenes eliminadas: {max(0, len(imagenes) - limite)}")

# Forma de usar
ruta_imagenes = "C:\\Users\\lcald\\OneDrive\\Documentos\\ia"
eliminar_imagenes(ruta_imagenes)
