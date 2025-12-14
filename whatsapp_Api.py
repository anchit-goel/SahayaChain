from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

# In-memory storage for demo purposes
loan_requests = []

# Multilingual messages
responses = {
    'en': {
        'loan_confirm': "Your loan request for ₹{amount} has been received. We'll contact you soon.",
        'invalid': "Please send LOAN followed by the amount, e.g., LOAN 5000."
    },
    'hi': {
        'loan_confirm': "₹{amount} के लिए आपका लोन अनुरोध प्राप्त हुआ है। हम आपसे जल्द संपर्क करेंगे।",
        'invalid': "कृपया LOAN और राशि भेजें, जैसे LOAN 5000।"
    },  # ✅ Don't forget this comma
    'ta': {
        'loan_confirm': "₹{amount} கடன் கோரிக்கை பெறப்பட்டது. விரைவில் தொடர்புகொள்கிறோம்.",
        'invalid': "தயவு செய்து LOAN மற்றும் தொகையை அனுப்பவும். உதாரணம்: LOAN 5000."
    },  # ✅ Comma here too
    'mr': {
        'loan_confirm': "₹{amount} साठी कर्ज विनंती प्राप्त झाली आहे. लवकरच संपर्क करू.",
        'invalid': "कृपया LOAN आणि रक्कम पाठवा, उदा. LOAN 5000."
    },  # ✅ Comma here too
    'kn': {
        'loan_confirm': "₹{amount}ಗಾಗಿ ನಿಮ್ಮ ಸಾಲದ ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
        'invalid': "ದಯವಿಟ್ಟು LOAN ಮತ್ತು ಮೊತ್ತವನ್ನು ಕಳುಹಿಸಿ. ಉದಾ: LOAN 5000."
    }  # ✅ No comma needed here, it's the last one
}

# Language detection based on SMS content
def detect_language(body):
    if any(word in body.lower() for word in ['लोन', 'अनुरोध']):
        return 'hi'
    elif any(word in body.lower() for word in ['கடன்']):
        return 'ta'
    elif any(word in body.lower() for word in ['कर्ज']):
        return 'mr'
    elif any(word in body.lower() for word in ['ಸಾಲ']):
        return 'kn'
    else:
        return 'en'

@app.route("/sms", methods=['POST'])
def sms_reply():
    body = request.form.get('Body', '').strip()
    sender = request.form.get('From')
    lang = detect_language(body)

    # Extract loan amount
    import re
    match = re.search(r'\b(?:loan|लोन|கடன்|कर्ज)\s*(\d+)', body.lower())
    resp = MessagingResponse()
    msg = resp.message()

    if match:
        amount = match.group(1)
        loan_requests.append({'from': sender, 'amount': amount, 'lang': lang})
        reply = responses[lang]['loan_confirm'].format(amount=amount)
    else:
        reply = responses[lang]['invalid']

    msg.body(reply)
    return str(resp)

if __name__ == "__main__":
    app.run(debug=True)
