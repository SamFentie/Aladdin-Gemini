import React, { useState,useEffect } from 'react'
import "./Home.css"
import Sidebar from '../Components/Sidebar/Sidebar'
import Body from '../Components/Body/Body'
export default function Home() {
    const [extend,setExtend]= useState(true)
    const [input,setInput]=useState("")
    const [showResult,setShowResult]=useState(false)
    const [recentPrompt,setRecentPrompt]=useState("")
    const [loading,setLoading]= useState(false)
    const [collapse,setCollapse]=useState("")
    const [subject,setSubject]=useState("")
    const [books, setBooks]=useState([])
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const [grades,setGrades]=useState([])
    const [files,setFiles]=useState("")
    const [category,setCategory]=useState("All")
    const [catagories,setCategories]=useState([])
    const [selectedFile, setSelectedFile] = useState(null);
    const [booksUploaded, setBooksUploaded]=useState([])
  return (
    <div className='homediv'>
        <Sidebar files={files} setFiles={setFiles} category={category} catagories={catagories} selectedFile={selectedFile}  booksUploaded={booksUploaded} setCategory={setCategory} setCategories={setCategories} setSelectedFile={setSelectedFile}  setBooksUploaded={setBooksUploaded} grades={grades} setGrades={setGrades} extend={extend} setExtend={setExtend}collapse={collapse} subject={subject} books={books} countries={countries} selectedCountry={selectedCountry} setCollapse={setCollapse} setSubject={setSubject} setBooks={setBooks} setCountries={setCountries} setSelectedCountry={setSelectedCountry}/>
        <Body setLoading={setLoading} selectedCountry={selectedCountry} subject={subject} collapse={collapse} input={input} loading={loading} setRecentPrompt={setRecentPrompt} recentPrompt={recentPrompt} extend={extend} setInput={setInput} showResult={showResult} setShowResult={setShowResult}/>
    </div>
  )
}
