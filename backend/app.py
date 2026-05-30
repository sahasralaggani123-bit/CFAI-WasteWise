from flask import Flask, jsonify
from flask_cors import CORS
from database import init_db
from routes.auth_routes import auth_bp
from routes.bin_routes import bin_bp
from routes.waste_routes import waste_bp
from routes.analytics_routes import analytics_bp
from routes.notification_routes import notification_bp
from routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'wastewise-demo-secret'
    CORS(app)
    init_db()
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bin_bp, url_prefix='/api/bins')
    app.register_blueprint(waste_bp, url_prefix='/api/waste')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    @app.get('/api/health')
    def health(): return jsonify(success=True, service='WasteWise AI')
    return app

app = create_app()
if __name__ == '__main__': app.run(debug=True, host='0.0.0.0', port=5000)
