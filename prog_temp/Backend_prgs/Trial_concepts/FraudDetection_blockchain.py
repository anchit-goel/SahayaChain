from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from models import db, Loan
from my_blockchain import Blockchain, Block
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Malhar12@localhost/loan_db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
blockchain = Blockchain()

@app.before_first_request
def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/')
def home():
    if not blockchain.is_chain_valid():
        return render_template("alert.html")
    return render_template('index.html')

@app.route('/request-loan', methods=['GET', 'POST'])
def request_loan():
    if request.method == 'POST':
        borrower = request.form['borrower']
        amount = float(request.form['amount'])
        timestamp = datetime.now()

        data = f"{borrower}:{amount}:{timestamp}"
        new_block = blockchain.add_block(data)

        loan = Loan(
            borrower=borrower,
            amount=amount,
            timestamp=timestamp,
            block_hash=new_block.hash,
            previous_hash=new_block.previous_hash
        )

        db.session.add(loan)
        db.session.commit()

        return render_template("confirmation.html", borrower=borrower, amount=amount)
    
    return render_template("request_loan.html")

@app.route('/view-loans')
def view_loans():
    if not blockchain.is_chain_valid():
        return render_template("alert.html")
    
    loans = Loan.query.all()
    return render_template("loans.html", loans=loans)

@app.route('/view-blockchain')
def view_blockchain():
    if not blockchain.is_chain_valid():
        return render_template("alert.html")
    
    return render_template("blockchain.html", blocks=blockchain.chain)

@app.route('/update-loan/<int:loan_id>', methods=['GET', 'POST'])
def update_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    old_amount = loan.amount

    if request.method == 'POST':
        new_amount = float(request.form['new_amount'])

        if new_amount != old_amount:
            loan.amount = new_amount
            loan.timestamp = datetime.now()

            # Use the same hashing method from Blockchain
            from my_blockchain import Block
            data = f"{loan.borrower}:{loan.amount}:{loan.timestamp}"
            new_block = Block(
                index=loan.id,
                timestamp=loan.timestamp,
                data=data,
                previous_hash=loan.previous_hash
            )
            loan.block_hash = new_block.hash

            db.session.commit()

        return redirect(url_for('view_loans'))

    return render_template("update_loan.html", loan=loan)

@app.route('/fraud-check')
def fraud_check():
    loans = Loan.query.order_by(Loan.id).all()
    fraud_detected = []

    for loan in loans:
        data = f"{loan.borrower}:{loan.amount}:{loan.timestamp}"
        computed_block = Block(
            index=loan.id,
            timestamp=str(loan.timestamp),
            data=data,
            previous_hash=loan.previous_hash
        )
        computed_hash = computed_block.compute_hash()

        if loan.block_hash != computed_hash:
            fraud_detected.append({
                "loan_id": loan.id,
                "expected_hash": computed_hash,
                "stored_hash": loan.block_hash,
                "borrower": loan.borrower,
                "amount": loan.amount
            })

    if fraud_detected:
        return render_template("alert.html", frauds=fraud_detected)
    else:
        return "✅ No tampering detected. All loans are authentic."



if __name__ == '__main__':
    app.run(debug=True)
