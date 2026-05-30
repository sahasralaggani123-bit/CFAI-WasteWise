import jwt
from flask import Blueprint, current_app, jsonify, request
from models.user import User
auth_bp=Blueprint('auth',__name__)
@auth_bp.post('/login')
def login():
    data=request.get_json() or {}; user=User.find_by_email(data.get('email',''))
    if not user or user['password'] != data.get('password'): return jsonify(success=False,message='Invalid credentials'),401
    token=jwt.encode({'id':user['id'],'role':user['role']}, current_app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify(success=True,token=token,user={'id':user['id'],'name':user['name'],'email':user['email'],'role':user['role']})
@auth_bp.post('/register')
def register():
    data=request.get_json() or {}; uid=User.create(data.get('name'),data.get('email'),data.get('password'))
    return jsonify(success=True,user_id=uid)
