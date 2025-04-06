from twilio.rest import Client
import random

account_sid = 'AC4a2e1a6c9249d113794b7228edc9773a'
auth_token = 'c71e19fc3025d9cb6e09bfd4e7f6acc1'
twilio_phone_number = '+13026182110'

client = Client(account_sid, auth_token)

def generate_otp():
    return random.randint(1000, 9999)

def send_otp(phone_number, otp):
    message = client.messages.create(
        body=f'Your OTP is: {otp}',
        from_=twilio_phone_number,
        to=phone_number
    )
    return message.sid

# Replace with your actual number including country code (e.g., +91 for India)
phone_number = '+919343484097'
otp = generate_otp()
sid = send_otp(phone_number, otp)

print(f'OTP sent to {phone_number}: {otp}')
