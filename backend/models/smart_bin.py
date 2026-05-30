from database import get_db
class SmartBin:
    @staticmethod
    def all(): return [dict(r) for r in get_db().execute('SELECT * FROM bins ORDER BY id').fetchall()]
