import pandas as pd
from datetime import datetime
import os.path
import msoffcrypto
import io

def get_loan_info():
    """Function to collect loan information from user"""
    print("\n=== Loan Information Entry System ===")
    
    # Collect inputs with validation
    borrower_name = input("Enter Borrower Name: ")
    
    # Phone validation
    while True:
        phone = input("Enter Phone Number: ")
        if phone.replace("-", "").replace(" ", "").isdigit():
            break
        print("Invalid phone format. Please enter digits only.")
    
    # Loan amount validation
    while True:
        try:
            loan_amt = float(input("Enter Loan Amount: $"))
            if loan_amt > 0:
                break
            print("Loan amount must be positive.")
        except ValueError:
            print("Please enter a valid number.")
    
    # Due date validation
    while True:
        due_date_str = input("Enter Due Date (YYYY-MM-DD): ")
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
            due_date_str = due_date.strftime("%Y-%m-%d")
            break
        except ValueError:
            print("Invalid date format. Please use YYYY-MM-DD.")
    
    # Paid amount validation
    while True:
        try:
            paid_amt = float(input("Enter Paid Amount: $"))
            if paid_amt >= 0:
                break
            print("Paid amount cannot be negative.")
        except ValueError:
            print("Please enter a valid number.")
    
    # Determine status automatically
    if paid_amt >= loan_amt:
        status = "Paid"
    elif paid_amt > 0:
        status = "Partial"
    else:
        status = "Unpaid"
    
    print(f"Status automatically set to: {status}")
    
    # Return collected data as dictionary
    return {
        "Borrower Name": borrower_name,
        "Phone": phone,
        "Loan Amount": loan_amt,
        "Due Date": due_date_str,
        "Paid Amount": paid_amt,
        "Status": status
    }

def save_to_encrypted_excel(loan_data, filename="loan_records.xlsx", password=None):
    """Save loan data to encrypted Excel file"""
    # If no password is provided, ask for one
    if password is None:
        password = input("Enter password to encrypt the Excel file: ")
        confirm_password = input("Confirm password: ")
        if password != confirm_password:
            print("Passwords do not match. Using default password.")
            password = "default_password"  # You might want to handle this differently
    
    temp_filename = "temp_loan_records.xlsx"
    
    # Check if file exists and load existing data
    if os.path.isfile(filename):
        try:
            # First decrypt the existing file
            with open(filename, "rb") as file:
                office_file = msoffcrypto.OfficeFile(file)
                try:
                    # Try to decrypt with the provided password
                    office_file.load_key(password=password)
                    decrypted = io.BytesIO()
                    office_file.decrypt(decrypted)
                    decrypted.seek(0)
                    existing_df = pd.read_excel(decrypted)
                    updated_df = pd.concat([existing_df, pd.DataFrame([loan_data])], ignore_index=True)
                except Exception as e:
                    print(f"Error decrypting file (possibly wrong password): {e}")
                    print("Creating new file with your data.")
                    updated_df = pd.DataFrame([loan_data])
        except Exception as e:
            print(f"Error reading existing file: {e}")
            updated_df = pd.DataFrame([loan_data])
    else:
        # Create new DataFrame
        updated_df = pd.DataFrame([loan_data])
    
    try:
        # Save to temporary unencrypted Excel file
        updated_df.to_excel(temp_filename, index=False)
        
        # Encrypt the file
        with open(temp_filename, "rb") as file:
            content = file.read()
        
        # Create encrypted file
        office_file = msoffcrypto.OfficeFile(io.BytesIO(content))
        office_file.encrypt(password=password)
        
        with open(filename, "wb") as output:
            office_file.write(output)
        
        # Remove temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            
        print(f"\nLoan information successfully saved to encrypted file {filename}")
    except Exception as e:
        print(f"Error saving to encrypted Excel: {e}")
        # If encryption fails, at least save unencrypted
        if not os.path.exists(temp_filename):
            updated_df.to_excel(temp_filename, index=False)
            print(f"Data saved to unencrypted file {temp_filename} as fallback")

def main():
    """Main function to run the program"""
    print("Welcome to Loan Information System")
    
    # Ask for password once at the beginning
    password = input("Enter password for Excel encryption (leave blank for no encryption): ")
    if password == "":
        password = None
    
    while True:
        # Get loan information
        loan_data = get_loan_info()
        
        # Save to encrypted Excel
        save_to_encrypted_excel(loan_data, password=password)
        
        # Ask if user wants to add another entry
        choice = input("\nDo you want to add another loan record? (y/n): ").lower()
        if choice != 'y':
            break
    
    print("Thank you for using the Loan Information System!")

if __name__ == "__main__":
    main()