from flask import Blueprint, jsonify
admin_bp=Blueprint('admin',__name__)
@admin_bp.get('/summary')
def summary(): return jsonify(success=True,summary={'total_users':1042,'active_bins':5,'waste_records':8741,'critical_alerts':2})
