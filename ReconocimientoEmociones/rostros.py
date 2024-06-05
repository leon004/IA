import numpy as np
import cv2 as cv
import os

# Ruta del archivo haarcascade_frontalface_alt.xml
cascade_path = 'C:\\Users\\lcald\\OneDrive\\Documentos\\ia\\haarcascade_frontalface_alt.xml'

# Verificar si el archivo existe
if not os.path.exists(cascade_path):
    print(f"El archivo no se encuentra en la ruta especificada: {cascade_path}")
    exit()

# Cargar el clasificador de rostros
rostro = cv.CascadeClassifier(cascade_path)

# Verificar si el clasificador se cargó correctamente
if rostro.empty():
    print(f"No se pudo cargar el clasificador de rostros desde {cascade_path}")
    exit()

# Capturar video desde la cámara
cap = cv.VideoCapture(0)
i = 0
while True:
    ret, frame = cap.read()
    if not ret:
        print("No se pudo capturar el video.")
        break

    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    rostros = rostro.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in rostros:
        frame2 = frame[y:y+h, x:x+w]
        frame2 = cv.resize(frame2, (100, 100), interpolation=cv.INTER_AREA)
        cv.imshow('rostros encontrados', frame2)
        cv.imwrite(f'C:\\Users\\lcald\\OneDrive\\Documentos\\ia\\rostro_{i}.png', frame2)
    i += 1
    k = cv.waitKey(1)
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
