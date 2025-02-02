import openai
from Firebase.pdf import pdf_conv

# Set your OpenAI API key
openai.api_key = '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'

def formatting(transcription_text):
    response = openai.ChatCompletion.create(
    model="gpt-4o",
    messages=[
        {
        "role": "system",
        "content": "You have been given a specific raw text. Your task is to extract and format relevant information in order (Make sure there is a summary in the end): Symptoms (if nothing then NA), Medical condition/Inference(if nothing then NA), Medication(if nothing then NA), Medical Procedures(if nothing then NA), Additional info(if nothing then NA), Summary (A small 2-3 sentence description from the raw text). Separate the following info by a tab space. Each header should have a colon (:) following it."
        },
        {
        "role": "user",
        "content": transcription_text
        }
    ],
    temperature=0.5,
    max_tokens=128,
    top_p=1
    )
    content_output = response.choices[0].message['content']
    print(content_output)
    pdf_conv(content_output)
    return content_output




