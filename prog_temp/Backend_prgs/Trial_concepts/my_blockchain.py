import hashlib
import pymysql

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.compute_hash()

    def compute_hash(self):
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}"
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = []
        self.load_chain_from_db()

    def add_block(self, data):
        index = len(self.chain)
        timestamp = data.split(":")[-1]
        previous_hash = self.chain[-1].hash if self.chain else '0'
        block = Block(index, timestamp, data, previous_hash)
        self.chain.append(block)
        return block

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            if current.hash != current.compute_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
        return True

    def load_chain_from_db(self):
        try:
            connection = pymysql.connect(
                host='localhost',
                user='root',
                password='Malhar12',  # ← change this if needed
                database='loan_db'
            )
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, borrower, amount, timestamp, block_hash, previous_hash FROM loan ORDER BY id")
                rows = cursor.fetchall()

                for row in rows:
                    id, borrower, amount, timestamp, block_hash, previous_hash = row
                    data = f"{borrower}:{amount}:{timestamp}"
                    block = Block(id, timestamp, data, previous_hash)
                    block.hash = block_hash  # use stored hash
                    self.chain.append(block)
        except Exception as e:
            print("Error loading chain:", e)
