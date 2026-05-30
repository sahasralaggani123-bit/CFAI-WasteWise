from database import get_db
class User:
    @staticmethod
    def find_by_email(email):
        return get_db().execute('SELECT * FROM users WHERE email=?',(email,)).fetchone()
    @staticmethod
    def create(name,email,password,role='citizen'):
        db=get_db(); cur=db.execute('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)',(name,email,password,role)); db.commit(); return cur.lastrowid
