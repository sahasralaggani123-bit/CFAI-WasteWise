from flask import Blueprint, jsonify
from models.support_models import AnalyticsManager
analytics_bp=Blueprint('analytics',__name__)
@analytics_bp.get('')
def stats(): return jsonify(success=True,statistics=AnalyticsManager().statistics())
