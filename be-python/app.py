from datetime import datetime
from io import BytesIO
import math
from flask import Flask, request, jsonify
import mysql.connector
import face_recognition
import requests


app = Flask(__name__)
label_Predictions = ["Wajah Cocok !", "Wajah Tidak Cocok !"]

# Mengatur koneksi database
db_config = {
    'user': 'root',
    'password': 'yzzNjVRPfAmZHGCBDawzrbgfkwJALJYL',
    'host': 'autorack.proxy.rlwy.net',
    'port': '21582',
    'database': 'railway'
}

# Membuat koneksi ke database
def get_db_connection():
    return mysql.connector.connect(**db_config)

office_coords = (-0.8873185,119.8772979)


def algoritma_haversine(coords1, coords2):
    R = 6371
    lat1, lon1 = coords1
    lat2, lon2 = coords2
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

@app.route('/upload-image', methods=['POST'])
def face_recog():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    user_id = request.form.get('userId')
    status = request.form.get('status')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    user_location = (float(latitude), float(longitude))
    
    try:
        upload_image = face_recognition.load_image_file(file)
        upload_encodings = face_recognition.face_encodings(upload_image)
        
        if len(upload_encodings) == 0:
            return jsonify({'message': 'No face found in uploaded image'}), 400
        
        # Mengambil URL wajah dari database
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT url FROM tb_face WHERE user_id = %s", (user_id,))
        urls = [row[0] for row in cursor.fetchall()]
        db_encodings = []
        
        for url in urls:
            response = requests.get(url)
            image = face_recognition.load_image_file(BytesIO(response.content))
            face_encoding = face_recognition.face_encodings(image)
            
            if face_encoding:
                db_encodings.append(face_encoding[0])
        
        cursor.close()
        connection.close()
        
        if len(db_encodings) == 0:
            return jsonify({'message': 'Wajah anda tidak terdaftar dalam database!'}), 400
        
        for camera_encoding in upload_encodings:
            face_distance = face_recognition.face_distance(db_encodings, camera_encoding)
        
        predictions = (1 - face_distance[0]) * 100
        if predictions > 50:
            now = datetime.now()
            formated_datetime = now.strftime("%Y-%m-%d %H:%M:%S")
            data_today = now.date()
            current_time = now.time()
            # Memeriksa absensi
            connection = get_db_connection()
            cursor = connection.cursor()
            
            cursor.execute('SELECT * FROM tb_absensi WHERE user_id = %s AND tanggal_absensi = %s AND status_absensi = %s', 
                           (user_id, data_today, status))
            absensi_records = cursor.fetchall()
            
            if len(absensi_records) > 0:
                return jsonify({'message': 'Anda sudah melakukan absensi!'}), 400
            
            distance = algoritma_haversine(office_coords, user_location)
            if distance > 0.05:
                return jsonify({'message': 'Lokasi tidak valid untuk absensi! Jarak dari lokasi kantor terlalu jauh.', "error": 'location'}), 400
            
            
            # Menyimpan data absensi
            cursor.execute(
                'INSERT INTO tb_absensi (user_id, tanggal_absensi, jam_absensi, status_absensi, status_kehadiran, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                (user_id, data_today, current_time, status, 'Hadir', formated_datetime, formated_datetime)
            )
            connection.commit()
            cursor.close()
            connection.close()
            
            result_face = label_Predictions[0]
            return jsonify({"prediction": predictions, "message": result_face}), 200
        else:
            result_face = label_Predictions[1]
            return jsonify({"prediction": predictions, "message": result_face}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def getData():
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute('SELECT * FROM tb_user')
    data = cursor.fetchall()
    
    data_list = []
    for item in data:
        data_list.append({'id_user': item[0]})
    
    cursor.close()
    connection.close()
    
    return jsonify({'data': data_list})

if __name__ == "__main__":
    app.run(host='192.168.1.55', port=5001, debug=True)
