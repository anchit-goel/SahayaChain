from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    borrower = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    block_hash = db.Column(db.String(64), nullable=False)
    previous_hash = db.Column(db.String(64), nullable=False)
