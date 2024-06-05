import cv2 as cv 
import numpy as np 
import os

dataSet = 'C:\\Users\\lcald\\OneDrive\\Escritorio\\ia\\Persones'
faces = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0 

for face in faces:
    facePath = os.path.join(dataSet, face)
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(os.path.join(facePath, faceName), 0))
    label += 1

# print(np.count_nonzero(np.array(labels)==0)) 
faceRecognizer = cv.face.LBPHFaceRecognizer_create()
faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write('C:\\Users\\lcald\\OneDrive\\Escritorio\\ia\\XML2\\LBPHPersonesFix.xml')
