import serial
import time
import mysql.connector

arduino = serial.Serial('COM5', 9600) # Remplacez 'COM3' par le port série de votre Arduino

def connect_to_db():
    config = {
        'user': 'alan',
        'password': 'luka77',
        'host': 'localhost',
        'database': 'box_domo',
    }
    return mysql.connector.connect(**config)

def get_light_state(conn):
    cursor = conn.cursor()
    query = "SELECT etat_lumiere FROM nom_de_la_table WHERE id = 1"
    cursor.execute(query)
    result = cursor.fetchone()
    return result[0]

def set_led_state(state):
    arduino.write(b'ON' if state == 1 else b'OFF')

conn = connect_to_db()

while True:
    if arduino.in_waiting > 0:
        data = arduino.readline().decode().strip()
        if data == 'SWITCH':
            light_state = get_light_state(conn)
            set_led_state(light_state)
        time.sleep(0.1)
