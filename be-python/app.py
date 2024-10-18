from datetime import datetime, timedelta
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

office_coords = (-0.848711,119.888440)

# Algoritma Haversine
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

    # Validasi input
    if not all([user_id, status, latitude, longitude]):
        return jsonify({'message': 'Data tidak lengkap!'}), 400

    user_location = (float(latitude), float(longitude))

    try:
        # Proses gambar yang diunggah
        upload_image = face_recognition.load_image_file(file)
        upload_encodings = face_recognition.face_encodings(upload_image)

        if len(upload_encodings) == 0:
            return jsonify({'message': 'No face found in uploaded image'}), 400

        # Ambil URL wajah dari database
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT url FROM tb_face WHERE user_id = %s", (user_id,))
        urls = [row[0] for row in cursor.fetchall()]

        if not urls:
            return jsonify({'message': 'Wajah anda tidak terdaftar dalam database!'}), 400

        db_encodings = []
        for url in urls:
            response = requests.get(url)
            image = face_recognition.load_image_file(BytesIO(response.content))
            face_encoding = face_recognition.face_encodings(image)

            if face_encoding:
                db_encodings.append(face_encoding[0])

        if len(db_encodings) == 0:
            return jsonify({'message': 'Gagal memuat encoding wajah dari database!'}), 500

        # Pengecekan kecocokan wajah
        for camera_encoding in upload_encodings:
            face_distance = face_recognition.face_distance(db_encodings, camera_encoding)

        predictions = (1 - face_distance[0]) * 100
        if predictions <= 50:
            return jsonify({'prediction': predictions, 'message': 'Wajah tidak dikenali'}), 400

        # Memproses absensi jika wajah dikenali
        now = datetime.now()
        data_today = now.date()
        formated_datetime = now.strftime("%Y-%m-%d %H:%M:%S")
        current_time = now.time()

        # Periksa apakah sudah absen dengan status yang sama hari ini
        cursor.execute(
            'SELECT * FROM tb_absensi WHERE user_id = %s AND tanggal_absensi = %s AND status_absensi = %s',
            (user_id, data_today, status)
        )
        absensi_records = cursor.fetchall()

        if absensi_records:
            return jsonify({'message': 'Anda sudah melakukan absensi!'}), 400

        # Periksa apakah ada absensi lain dengan status berbeda
        cursor.execute(
            'SELECT * FROM tb_absensi WHERE user_id = %s AND tanggal_absensi = %s AND status_absensi = %s AND status_kehadiran != %s',
            (user_id, data_today, 1, "Hadir")
        )
        check_absensi = cursor.fetchall()

        if check_absensi:
            try:
                cursor.execute(
                    'INSERT INTO tb_absensi (user_id, tanggal_absensi, jam_absensi, status_absensi, status_kehadiran, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                    (user_id, data_today, current_time, status, check_absensi[0][5], formated_datetime, formated_datetime)
                )
                connection.commit()  # Commit perubahan ke database
                return jsonify({"message": f"Anda sudah melakukan absensi dengan status {check_absensi[0][5]}!"}), 400
            except Exception as e:
                return jsonify({"error": "Gagal menyimpan absensi!"}), 500
        # Periksa apakah ada absensi lain dengan status berbeda
        cursor.execute(
            'SELECT * FROM tb_absensi WHERE user_id = %s AND tanggal_absensi = %s AND status_absensi = %s',
            (user_id, data_today, 1)
        )
        check_absen_pagi = cursor.fetchall()

        if len(check_absen_pagi) == 0 and int(status) == 2:
            return jsonify({"message": "Anda tidak melakukan absen pagi!"}), 400
        
        # Hitung jarak dengan algoritma Haversine
        distance = algoritma_haversine(office_coords, user_location)
        if distance > 0.03:
            return jsonify({'message': 'Lokasi tidak valid untuk absensi! Jarak dari lokasi kantor terlalu jauh.', "error": 'location'}), 400

        # Simpan data absensi
        status_kehadiran = 'Hadir' if not check_absensi else check_absensi[0]['status_kehadiran']
        cursor.execute(
            'INSERT INTO tb_absensi (user_id, tanggal_absensi, jam_absensi, status_absensi, status_kehadiran, createdAt, updatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s)',
            (user_id, data_today, current_time, status, status_kehadiran, formated_datetime, formated_datetime)
        )
        cursor.close()
        connection.close()
        connection.commit()
        return jsonify({"prediction": predictions, "message": "Absensi berhasil!"}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='192.168.1.16', port=5001, debug=True)
