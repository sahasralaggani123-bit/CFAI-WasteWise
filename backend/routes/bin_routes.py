from flask import Blueprint, jsonify
from models.smart_bin import SmartBin
bin_bp=Blueprint('bins',__name__)
@bin_bp.get('')
def bins(): return jsonify(success=True,bins=SmartBin.all())
