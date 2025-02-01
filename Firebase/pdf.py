import string
from fpdf import FPDF

#sample text
'''
text = 
Symptoms: Flaring of acne, two small folliculitis lesions  
Medical condition/Inference: Acne, folliculitis
Medication: Amoxilin 500-MGBID, Tazorac Cream 0.1
Medical Procedures: Photo facials at Healing Waters
Additional info: The patient is married, works as a secretary, has hay fever, eczema, sinus issues.

Summary: The patient has been experiencing a flare-up of acne and folliculitis lesions on her chest, stomach, neck, and back for the past two months. She has been using Amoxilin and Tazorac Cream, but has been out'''

def pdf_conv(text, output_path=r'C:\Users\gteja\Documents\Prescribe_recordings\patient_record.pdf'):
    lines = text.strip().split('\n')
    pdf = FPDF()
    pdf.add_page()

    # Set the default font for the PDF
    pdf.set_font("Arial", size=12)

    headers = ["Symptoms", "Medication", "Medical Procedures", "Additional info", "Summary"]

    for line in lines:
        if ':' in line:
            head, content = line.split(':', 1)
            if head.strip() in headers:
                pdf.set_font("Arial", 'B', size=13)
                pdf.cell(0, 8, txt=head.strip() + ':', ln=True)
                pdf.set_font("Arial", size=12)
                pdf.multi_cell(0, 9, txt=content.strip())
            else:
                pdf.set_font("Arial", size=12)
                pdf.multi_cell(0, 9, txt=line.strip())
        else:
            # Handle lines without a colon
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 9, txt=line.strip())

    # Output the PDF to a file
    pdf.output(output_path)