import mysql.connector
from mysql.connector import errorcode

u ='admin'
p = 'andresprueba123'
h = 'institucioneducacionsuperior.c7gsk0yc43rw.us-east-2.rds.amazonaws.com'
d = 'InstitucionEducacionSuperior'
p = '3306'

conn = mysql.connector.connect(
        host=h,
        user=u,
        password='andresprueba123',
        database=d,
        port=p
    )
cursor = conn.cursor()
query = "SELECT * FROM Estudiantes"
cursor.execute(query)
results = cursor.fetchall()
print(results[0])