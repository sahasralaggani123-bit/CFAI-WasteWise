from flask import Blueprint, jsonify
from models.support_models import NotificationManager
notification_bp=Blueprint('notifications',__name__)
@notification_bp.get('')
def notifications(): return jsonify(success=True,notifications=NotificationManager().all())
