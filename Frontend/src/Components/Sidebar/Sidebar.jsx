import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { CountrySelect } from '../CountrySelect/CountrySelect'
import menu_icon from "../../assets/menu_icon.png"
import axios from 'axios';
export default function Sidebar({files,setFiles,category,catagories,selectedFile,booksUploaded,setCategory,setCategories,setSelectedFile,setBooksUploaded,grades,setGrades,extend,setExtend,collapse,subject,books,countries,selectedCountry,setCollapse,setSubject,setBooks,setCountries,setSelectedCountry}) {
    const [message, setMessage]=useState("")
    const fetchBooks=async()=>{ 
        if(collapse!=""){
            const url=`http://127.0.0.1:5000/books/${selectedCountry["value"]}/${collapse.split("Grade ")[1]}`
            await fetch(url).then(response=>response.json()).then(data=>{setBooks(data["books"])}) }}
    const fetchBooksUploaded=async()=>{ 
                if(collapse!=""){
                    const url=`http://127.0.0.1:5000/uploadedBooks/${collapse}`
                    await fetch(url).then(response=>response.json()).then(data=>{setBooksUploaded(data["books"])}) }}
    const fetchGrades=async()=>{
        const url=`http://127.0.0.1:5000/grades/${selectedCountry["value"]}`
        await fetch(url).then(response=>response.json()).then(data=>{setGrades(data["grades"])}) }
    const fetchCategories=async()=>{
            const url=`http://127.0.0.1:5000/uploadedCategories`
            await fetch(url).then(response=>response.json()).then(data=>{setCategories(data["categories"])}) }
    useEffect(()=>{
        fetchBooks()
        fetchBooksUploaded()
        },[collapse])
    useEffect(()=>{
        fetchGrades()
        fetchCategories()
        },[selectedCountry])
    const handleFileUpload = (event) => {
         
          setSelectedFile(event.target.files[0]);
        }; 
    const handleUpload = () => {
          const formData = new FormData();
          if(selectedFile){
          formData.append('file', selectedFile);
          axios.post(`http://127.0.0.1:5000/upload/${category?category:"All"}`, formData)
            .then((response) => {
              
              fetchCategories()
              fetchBooksUploaded()
              setMessage(response.data);
              setFiles("types custome")
            //   console.log(selectedFile["name"].split(".")[0])
              setCollapse("categoryBook "+category)
              setSubject(selectedFile["name"].split(".")[0].replaceAll("_"," "))
            })
            .catch((error) => {
              console.log(error);
            });
        }
    };
  return (
    <div className={`sidebar${extend?"":"true"}`}>
        <div className="top">
            <img src={menu_icon} onClick={()=>setExtend(prev=>!prev)} alt="" /><br></br>
            <div className={`side-appear${extend?"":"true"}`}>
            <h4>Select Country</h4>
            <CountrySelect setGrades={setGrades} countries={countries} setCountries={setCountries} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/><br/>
            <hr />
            <div >
                    <p>Can't find the book you are looking for? Upload your own.</p>
                    <input className='text-input' type="text" placeholder='Have a category?' onChange={(e)=>setCategory(e.target.value)} />
                    <input type="file"  accept=".pdf" onChange={handleFileUpload} />
                    <button onClick={handleUpload}>Upload</button> 
                    <hr />
                    <button className={`type-btn ${files==="types custome"?"extend":""}`} onClick={()=>{files!==`types custome`?(setFiles(`types custome`)):setFiles("")}}>Custome Categories & Books</button>
                    <div className={`types ${files==="types custome"?"extend":""}`}>
                    {(catagories)?.map((item)=>{
                    return(
                    <>
                    <button className={`${collapse!==`categoryBook ${item}`?"":"categorySelected"}`} onClick={()=>{collapse!==`categoryBook ${item}`?(setCollapse(`categoryBook ${item}`)):setCollapse("")}}>{item}</button>
                    <div className={`categories${collapse===`categoryBook ${item}`?"extend":""}`}>
                    {(booksUploaded)?.map((item2)=>{
                        return(
                            <button onClick={()=>{subject!==item2?setSubject(item2):setSubject("")}} className={`subject ${subject===item2?"extend":""}`}>{item2.replaceAll("_"," ")}</button>       
                        )
                    })}
                    </div>
                    </>
                    )
                })}
                </div>
                <button className={`type-btn ${files==="types formal"?"extend":""}`} onClick={()=>{files!==`types formal`?(setFiles(`types formal`)):setFiles("")}}>National Books of {selectedCountry["label"]} </button>
                <div className={`types ${files==="types formal"?"extend":""}`}>
                {(grades)?.map((item)=>{
                    return(
                    <>
                    <button className={`${collapse!==`Grade ${item}`?"":"gradeSelected"}`} onClick={()=>{collapse!==`Grade ${item}`?(setCollapse(`Grade ${item}`)):setCollapse("")}}>Grade {item}</button>
                    <div className={`subjects${collapse===`Grade ${item}`?"extend":""}`}>
                    {(books)?.map((item2)=>{
                        return(
                        <button onClick={()=>{subject!==item2?setSubject(item2):setSubject("")}} className={`subject ${subject===item2?"extend":""}`}>{item2}</button>       
                        )
                    })}
                    </div>
                    </>
                
                    )
                })}
                </div>
            </div>
        </div>
        </div>
        <div className={`bottom ${extend?"":"true"}`}>
               
                <p className="bottom-info">
                {/* By<a href='https://leveldigitalsolutions.com'> Level Digital Solutions</a> */}<br></br>Powerd with Google Gemini 1.5<br></br>&copy;2024
                </p>
        </div>
    </div>
  )
}
