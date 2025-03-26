import mysql.connector
from mysql.connector import errorcode
import json

u ='admin'
p = 'andresprueba123'
h = 'institucioneducacionsuperior.c7gsk0yc43rw.us-east-2.rds.amazonaws.com'
d = 'InstitucionEducacionSuperior'
p = '3306'

def lambda_handler(event, context):
    conn = mysql.connector.connect(
        host=h,
        user=u,
        password='andresprueba123',
        database=d,
        port=p
    )
    cursor = conn.cursor()
    query = "SELECT * FROM Estudiantes WHERE estudiante_id =" + event['id']
    cursor.execute(query)
    results = cursor.fetchall()
    return {
        'Datos' : json.dumps(str(results))
    }