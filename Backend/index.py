#+

import re

import os
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()
os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
app=Flask(__name__)

def get_pdf_text(pdf_docs):
    text=""
    for pdf in pdf_docs:
        pdf_reader= PdfReader(pdf)
        for page in pdf_reader.pages:
            text+= page.extract_text()
    return  text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks,book_name):
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("Books/index/"+book_name+"_index")
 
def vectorise(pdf,book_name):
    pdf_docs=[pdf]
    raw_text=get_pdf_text(pdf_docs)
    text_chunks=get_text_chunks(raw_text)
    get_vector_store(text_chunks,book_name)

def get_conversational_chain():
    prompt_template = """
    answer the question based on the context provided,\n if the answer is not in context provided warn the user and provide your answer
    Context:\n {context}?\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest",
                             temperature=0.3)
    prompt = PromptTemplate(template = prompt_template, input_variables = ["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question,book_name):
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    new_db = FAISS.load_local(book_name+"_index", embeddings,allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain(
        {"input_documents":docs, "question": user_question}
        , return_only_outputs=True)
    return response["output_text"]

@app.route("/q/<country>/<grade>/<book_name>/<user_question>")
def runapp(country,grade,book_name,user_question):
    book_name = "Books/index/"+country.lower()+"g"+str(grade)+book_name
    answer={"ans":user_input(user_question.replace("%20"," "),book_name)}
    response= jsonify(answer)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
@app.route("/u/<catagory>/<book_name>/<user_question>")
def runUpload(catagory,book_name,user_question):
    book_name = "Books/index/"+catagory+"_-_"+book_name
    answer={"ans":user_input(user_question.replace("%20"," "),book_name)}
    response= jsonify(answer)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/books/<country>/<grade>")
def books(country,grade):
    books=[]
    country=country.lower()
    grade=str(grade)
    for pdfs in os.listdir("Books/index"):
        numbers=re.findall('\d+', pdfs)
        s = [str(i) for i in numbers]
        try:
            gradeFromPdf = int("".join(s))
            book_name = pdfs[4:][:-6].replace("_"," ") if len(grade)==1 else pdfs[5:][:-6].replace("_"," ")
            if(pdfs[:3]+str(gradeFromPdf)==country+"g"+grade):
                books.append(book_name.capitalize())
        except:
            continue
    response=jsonify({"books":sorted(books)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/grades/<country>")
def grades(country):
    grades=[]
    country=country.lower()
    for pdfs in os.listdir("Books/index/"):
        numbers=re.findall('\d+', pdfs)
        s = [str(i) for i in numbers]
        try:
            res = int("".join(s))
            grade = res
            if(pdfs[:3]==country+"g" and grade not in grades):
                grades.append(grade)
        except:
            continue
    response=jsonify({"grades":sorted(grades)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
@app.route("/upload/<category>", methods = ['POST']) 
def upload(category):  
    if request.method == 'POST':   
        f = request.files['file'] 
        f.save("Books/pdf/"+(category+"_-_"+f.filename).replace(" ","_"))
        vectorise("Books/pdf/"+(category+"_-_"+f.filename).replace(" ","_"),(category+"_-_"+(f.filename)[:-4]).replace(" ","_"))
    response=jsonify({"message":"Succesful"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/uploadedBooks/<categories>")
def uploadBook(categories):
    books=[]
    for pdfs in os.listdir("Books/pdf/"):
        book_name = pdfs.split(".")[0].split("_-_")
        try:
            if(categories.split("categoryBook ")[1]==book_name[0]):
                books.append(book_name[1])
        except:
            continue
    response=jsonify({"books":sorted(books)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/uploadedCategories")
def uploadCategories():
    category=[]
    for pdfs in os.listdir("Books/pdf/"):
        category_name = pdfs.split("_-_")
        if(category_name[0]not in category):
            category.append(category_name[0])
    response=jsonify({"categories":sorted(category)})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__=="__main__":
    app.run(debug=True)