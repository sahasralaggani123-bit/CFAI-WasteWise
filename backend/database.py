import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name('wastewise.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db(); cur = conn.cursor()
    cur.executescript('''
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'citizen');
    CREATE TABLE IF NOT EXISTS bins(id INTEGER PRIMARY KEY, bin_name TEXT, waste_type TEXT, location TEXT, fill_percent INTEGER, status TEXT, capacity INTEGER, lat REAL, lng REAL, distance TEXT);
    CREATE TABLE IF NOT EXISTS classifications(id INTEGER PRIMARY KEY, user_id INTEGER, category TEXT, confidence REAL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    ''')
    cur.execute("INSERT OR IGNORE INTO users(id,name,email,password,role) VALUES (1,'Arjun Kumar','user@wastewise.ai','password123','citizen'),(2,'Admin User','admin@wastewise.ai','password123','admin')")
    bins=[('Green Bin','Organic','Madhapur Sector 12',65,'Normal',200,17.447,78.391,'0.3 km'),('Blue Bin','Plastic','Madhapur Sector 12',88,'Warning',200,17.449,78.394,'0.5 km'),('Yellow Bin','Paper','Hitech City',42,'Normal',200,17.444,78.389,'0.8 km'),('Gray Bin','Metal','Gachibowli',95,'Full',200,17.443,78.397,'1.2 km'),('White Bin','Glass','Banjara Hills',30,'Normal',200,17.441,78.386,'1.9 km')]
    for i,b in enumerate(bins,1): cur.execute('INSERT OR IGNORE INTO bins(id,bin_name,waste_type,location,fill_percent,status,capacity,lat,lng,distance) VALUES (?,?,?,?,?,?,?,?,?,?)',(i,*b))
    conn.commit(); conn.close()
